#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

class CommitHelper {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
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

  // Get staged files
  getStagedFiles() {
    try {
      const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return output.split('\n').filter(file => file.trim());
    } catch {
      return [];
    }
  }

  // Get modified files (not staged)
  getModifiedFiles() {
    try {
      const output = execSync('git diff --name-only', { encoding: 'utf8' });
      return output.split('\n').filter(file => file.trim());
    } catch {
      return [];
    }
  }

  // Get untracked files
  getUntrackedFiles() {
    try {
      const output = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' });
      return output.split('\n').filter(file => file.trim());
    } catch {
      return [];
    }
  }

  // Analyze file changes for functionality
  analyzeFunctionalityChanges(files) {
    const functionalityKeywords = [
      'function', 'component', 'hook', 'api', 'route', 'handler',
      'logic', 'state', 'effect', 'context', 'provider', 'service',
      'utils', 'helper', 'config', 'type', 'interface', 'class'
    ];

    const functionalityFiles = files.filter(file => {
      const ext = path.extname(file);
      return ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext);
    });

    return functionalityFiles;
  }

  // Generate commit message based on changes
  generateCommitMessage(files) {
    const functionalityFiles = this.analyzeFunctionalityChanges(files);
    
    if (functionalityFiles.length === 0) {
      return 'chore: update non-functional files';
    }

    const fileTypes = new Set();
    functionalityFiles.forEach(file => {
      const ext = path.extname(file);
      if (ext === '.ts' || ext === '.tsx') fileTypes.add('typescript');
      else if (ext === '.js' || ext === '.jsx') fileTypes.add('javascript');
      else if (ext === '.json') fileTypes.add('config');
      else if (ext === '.md') fileTypes.add('documentation');
    });

    const type = Array.from(fileTypes).join('/');
    const count = functionalityFiles.length;
    
    return `feat: update ${type} functionality (${count} files)`;
  }

  // Prompt user for commit message
  async promptForCommitMessage(defaultMessage) {
    return new Promise((resolve) => {
      this.rl.question(`Commit message (default: "${defaultMessage}"): `, (answer) => {
        resolve(answer.trim() || defaultMessage);
      });
    });
  }

  // Prompt user for confirmation
  async promptForConfirmation(message) {
    return new Promise((resolve) => {
      this.rl.question(`${message} (y/N): `, (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  // Stage all changes
  stageAllChanges() {
    try {
      execSync('git add .', { stdio: 'inherit' });
      console.log('✅ All changes staged');
      return true;
    } catch (error) {
      console.error('❌ Failed to stage changes:', error.message);
      return false;
    }
  }

  // Stage specific files
  stageFiles(files) {
    try {
      if (files.length > 0) {
        execSync(`git add ${files.join(' ')}`, { stdio: 'inherit' });
        console.log(`✅ Staged ${files.length} files`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to stage files:', error.message);
      return false;
    }
  }

  // Commit changes
  commitChanges(message) {
    try {
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      console.log('✅ Changes committed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to commit changes:', error.message);
      return false;
    }
  }

  // Push changes
  pushChanges() {
    try {
      const branch = this.getCurrentBranch();
      execSync(`git push origin ${branch}`, { stdio: 'inherit' });
      console.log('✅ Changes pushed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to push changes:', error.message);
      return false;
    }
  }

  // Main workflow
  async run() {
    console.log('🚀 Commit Helper - Functionality Change Detector\n');

    if (!this.isGitRepo()) {
      console.error('❌ Not a git repository. Please run this from a git repository.');
      process.exit(1);
    }

    const branch = this.getCurrentBranch();
    console.log(`📍 Current branch: ${branch}\n`);

    // Get all file changes
    const stagedFiles = this.getStagedFiles();
    const modifiedFiles = this.getModifiedFiles();
    const untrackedFiles = this.getUntrackedFiles();

    console.log('📊 File Status:');
    console.log(`   Staged: ${stagedFiles.length} files`);
    console.log(`   Modified: ${modifiedFiles.length} files`);
    console.log(`   Untracked: ${untrackedFiles.length} files\n`);

    if (stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0) {
      console.log('✅ No changes to commit');
      this.rl.close();
      return;
    }

    // Ask what to stage
    const allFiles = [...modifiedFiles, ...untrackedFiles];
    const functionalityFiles = this.analyzeFunctionalityChanges(allFiles);

    if (functionalityFiles.length > 0) {
      console.log('🔧 Functionality changes detected:');
      functionalityFiles.forEach(file => console.log(`   ${file}`));
      console.log();

      const stageAll = await this.promptForConfirmation('Stage all functionality changes?');
      if (stageAll) {
        this.stageFiles(functionalityFiles);
      }
    }

    // Stage remaining changes if any
    const remainingFiles = allFiles.filter(file => !functionalityFiles.includes(file));
    if (remainingFiles.length > 0) {
      console.log('\n📁 Other changes:');
      remainingFiles.forEach(file => console.log(`   ${file}`));
      console.log();

      const stageOthers = await this.promptForConfirmation('Stage other changes?');
      if (stageOthers) {
        this.stageFiles(remainingFiles);
      }
    }

    // Get final staged files
    const finalStagedFiles = this.getStagedFiles();
    if (finalStagedFiles.length === 0) {
      console.log('❌ No files staged for commit');
      this.rl.close();
      return;
    }

    // Generate and confirm commit message
    const defaultMessage = this.generateCommitMessage(finalStagedFiles);
    const commitMessage = await this.promptForCommitMessage(defaultMessage);

    console.log(`\n📝 Commit message: ${commitMessage}`);
    const confirm = await this.promptForConfirmation('Proceed with commit?');
    
    if (confirm) {
      this.commitChanges(commitMessage);
      
      const push = await this.promptForConfirmation('Push changes to remote?');
      if (push) {
        this.pushChanges();
      }
    }

    this.rl.close();
  }
}

// Run the helper
const helper = new CommitHelper();
helper.run().catch(console.error); 