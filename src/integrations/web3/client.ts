import { create } from 'ipfs-http-client';

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// IPFS Configuration
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

// Utility for base64 encoding
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export interface AnonymousIdentity {
  address: string; // base64 public key
  publicKey: string; // base64
  privateKey: string; // base64 (exported, encrypted or plain for demo)
  pseudonym: string;
  reputation: number;
  createdAt: Date;
}

export interface AnonymousMessage {
  id: string;
  content: string;
  senderAddress: string;
  receiverAddress: string;
  timestamp: number;
  encryptedContent: string;
  ipfsHash: string;
  ephemeral: boolean;
  burnAfterRead: boolean;
  expiresAt?: number;
}

export class AnonymousChatClient {
  private currentIdentity: AnonymousIdentity | null = null;

  // Generate in-browser keypair
  async generateAnonymousIdentity(): Promise<AnonymousIdentity> {
    // Generate keypair using SubtleCrypto
    const keyPair = await window.crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt']
    );
    // Export keys
    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const publicKeyB64 = arrayBufferToBase64(publicKeyBuffer);
    const privateKeyB64 = arrayBufferToBase64(privateKeyBuffer);
    const pseudonym = this.generatePseudonym();
    const identity: AnonymousIdentity = {
      address: publicKeyB64,
      publicKey: publicKeyB64,
      privateKey: privateKeyB64,
      pseudonym,
      reputation: 0,
      createdAt: new Date()
    };
    this.currentIdentity = identity;
    return identity;
  }

  // No wallet connection needed
  async connectWallet(): Promise<boolean> {
    // Always return true (no wallet required)
    return true;
  }

  private generatePseudonym(): string {
    const adjectives = ['Mysterious', 'Shadow', 'Phantom', 'Ghost', 'Veiled', 'Hidden', 'Secret', 'Unknown'];
    const nouns = ['Traveler', 'Wanderer', 'Observer', 'Seeker', 'Explorer', 'Voyager', 'Pilgrim', 'Nomad'];
    const numbers = Math.floor(Math.random() * 9999);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}#${numbers.toString().padStart(4, '0')}`;
  }

  // Encrypt message content (simplified for demo)
  async encryptMessage(content: string, receiverPublicKey: string): Promise<string> {
    // For demo, just base64 encode (replace with real encryption for production)
    return window.btoa(content + '|' + receiverPublicKey);
  }

  // Store message on IPFS (unchanged)
  async storeMessageOnIPFS(message: Omit<AnonymousMessage, 'id' | 'ipfsHash'>): Promise<string> {
    const messageData = JSON.stringify(message);
    const result = await ipfs.add(messageData);
    return result.path;
  }

  // Send anonymous message
  async sendAnonymousMessage(
    receiverAddress: string,
    content: string,
    options: {
      ephemeral?: boolean;
      burnAfterRead?: boolean;
      expiresIn?: number;
    } = {}
  ): Promise<AnonymousMessage> {
    if (!this.currentIdentity) {
      throw new Error('No anonymous identity');
    }
    // Use receiverAddress as public key
    const receiverPublicKey = receiverAddress;
    const encryptedContent = await this.encryptMessage(content, receiverPublicKey);
    const message: Omit<AnonymousMessage, 'id' | 'ipfsHash'> = {
      content,
      senderAddress: this.currentIdentity.address,
      receiverAddress,
      timestamp: Date.now(),
      encryptedContent,
      ephemeral: options.ephemeral || false,
      burnAfterRead: options.burnAfterRead || false,
      expiresAt: options.expiresIn ? Date.now() + (options.expiresIn * 1000) : undefined
    };
    const ipfsHash = await this.storeMessageOnIPFS(message);
    const finalMessage: AnonymousMessage = {
      ...message,
      id: btoa(JSON.stringify(message) + Date.now()),
      ipfsHash
    };
    // No blockchain reference needed
    return finalMessage;
  }

  getCurrentIdentity(): AnonymousIdentity | null {
    return this.currentIdentity;
  }

  async updatePseudonym(newPseudonym: string): Promise<void> {
    if (!this.currentIdentity) {
      throw new Error('No anonymous identity');
    }
    this.currentIdentity.pseudonym = newPseudonym;
  }

  async getReputation(address: string): Promise<number> {
    return Math.floor(Math.random() * 100); // Placeholder
  }
}

export const anonymousChatClient = new AnonymousChatClient(); 