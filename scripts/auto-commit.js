#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

class AutoCommit {
  constructor() {
    this.debounceTimer = null;
    this.debounceDelay = 5000; // 5 seconds
    this.lastCommitTime = 0;
    this.minCommitInterval = 30000; // 30 seconds between commits
    this.watchedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss'];
    this.ignoredPatterns = [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.git/**',
      '*.log',
      '*.tmp',
      '*.cache'
    ];
  }

  // Check if git repository exists
  isGitRepo() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  // Get current branch
  getCurrentBranch() {
    try {
      return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch {
      return 'main';
    }
  }

  // Check if there are any changes
  hasChanges() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.trim().length > 0;
    } catch {
      return false;
    }
  }

  // Get changed files
  getChangedFiles() {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      return output
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.substring(3)); // Remove status prefix
    } catch {
      return [];
    }
  }

  // Analyze functionality changes
  analyzeFunctionalityChanges(files) {
    const functionalityFiles = files.filter(file => {
      const ext = path.extname(file);
      return this.watchedExtensions.includes(ext);
    });

    return functionalityFiles;
  }

  // Generate commit message
  generateCommitMessage(files) {
    const functionalityFiles = this.analyzeFunctionalityChanges(files);
    
    if (functionalityFiles.length === 0) {
      return 'chore: auto-commit non-functional changes';
    }

    const fileTypes = new Set();
    functionalityFiles.forEach(file => {
      const ext = path.extname(file);
      if (ext === '.ts' || ext === '.tsx') fileTypes.add('typescript');
      else if (ext === '.js' || ext === '.jsx') fileTypes.add('javascript');
      else if (ext === '.json') fileTypes.add('config');
      else if (ext === '.md') fileTypes.add('documentation');
      else if (ext === '.css' || ext === '.scss') fileTypes.add('styles');
    });

    const type = Array.from(fileTypes).join('/');
    const count = functionalityFiles.length;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    return `feat: auto-commit ${type} functionality (${count} files) - ${timestamp}`;
  }

  // Stage and commit changes
  commitChanges() {
    const now = Date.now();
    
    // Check minimum commit interval
    if (now - this.lastCommitTime < this.minCommitInterval) {
      console.log('⏰ Skipping commit - too soon since last commit');
      return;
    }

    if (!this.hasChanges()) {
      console.log('✅ No changes to commit');
      return;
    }

    try {
      // Stage all changes
      execSync('git add .', { stdio: 'inherit' });
      console.log('📦 Changes staged');

      // Get staged files for commit message
      const stagedFiles = this.getChangedFiles();
      const commitMessage = this.generateCommitMessage(stagedFiles);

      // Commit changes
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log('✅ Changes committed:', commitMessage);

      this.lastCommitTime = now;

      // Optionally push changes
      this.pushChanges();

    } catch (error) {
      console.error('❌ Failed to commit changes:', error.message);
    }
  }

  // Push changes to remote
  pushChanges() {
    try {
      const branch = this.getCurrentBranch();
      execSync(`git push origin ${branch}`, { stdio: 'inherit' });
      console.log('🚀 Changes pushed to remote');
    } catch (error) {
      console.log('⚠️  Failed to push changes (this is normal if no remote is configured)');
    }
  }

  // Debounced commit function
  debouncedCommit() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.commitChanges();
    }, this.debounceDelay);
  }

  // Watch for file changes
  watchFiles() {
    console.log('👀 Starting file watcher...');
    console.log(`📁 Watching extensions: ${this.watchedExtensions.join(', ')}`);
    console.log(`⏱️  Debounce delay: ${this.debounceDelay}ms`);
    console.log(`⏰ Min commit interval: ${this.minCommitInterval}ms`);
    console.log('Press Ctrl+C to stop\n');

    const watcher = chokidar.watch('.', {
      ignored: this.ignoredPatterns,
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', (path) => {
        console.log(`📄 File added: ${path}`);
        this.debouncedCommit();
      })
      .on('change', (path) => {
        console.log(`✏️  File changed: ${path}`);
        this.debouncedCommit();
      })
      .on('unlink', (path) => {
        console.log(`🗑️  File deleted: ${path}`);
        this.debouncedCommit();
      })
      .on('error', (error) => {
        console.error('❌ Watcher error:', error);
      });

    return watcher;
  }

  // Run in watch mode
  runWatch() {
    if (!this.isGitRepo()) {
      console.error('❌ Not a git repository. Please run this from a git repository.');
      process.exit(1);
    }

    const branch = this.getCurrentBranch();
    console.log(`📍 Current branch: ${branch}`);

    const watcher = this.watchFiles();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping file watcher...');
      watcher.close();
      process.exit(0);
    });
  }

  // Run single commit
  runSingle() {
    if (!this.isGitRepo()) {
      console.error('❌ Not a git repository. Please run this from a git repository.');
      process.exit(1);
    }

    console.log('🚀 Running single auto-commit...');
    this.commitChanges();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const autoCommit = new AutoCommit();

if (args.includes('--watch') || args.includes('-w')) {
  autoCommit.runWatch();
} else if (args.includes('--single') || args.includes('-s')) {
  autoCommit.runSingle();
} else {
  console.log('Usage:');
  console.log('  node auto-commit.js --watch    # Watch for changes and auto-commit');
  console.log('  node auto-commit.js --single   # Run single auto-commit');
  console.log('  node auto-commit.js -w         # Short form for watch');
  console.log('  node auto-commit.js -s         # Short form for single');
} 