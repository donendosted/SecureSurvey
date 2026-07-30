import type { WalletConnectionResult } from '../types';
import { WalletClient } from './wallet-client';
import type { SDKConfig } from '../types';

export type WalletEventHandler = (event: WalletEvent) => void;

export interface WalletEvent {
  type: 'connected' | 'disconnected' | 'accountChanged' | 'balanceChanged' | 'error';
  data?: unknown;
  timestamp: string;
}

export class WalletProvider {
  private client: WalletClient;
  private listeners: Set<WalletEventHandler> = new Set();
  private connectionResult: WalletConnectionResult | null = null;

  constructor(config: SDKConfig) {
    this.client = new WalletClient(config);
  }

  async connect(): Promise<WalletConnectionResult> {
    try {
      this.connectionResult = await this.client.connect();
      this.emit({ type: 'connected', data: this.connectionResult, timestamp: new Date().toISOString() });
      return this.connectionResult;
    } catch (error) {
      this.emit({ type: 'error', data: error, timestamp: new Date().toISOString() });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      this.connectionResult = null;
      this.emit({ type: 'disconnected', timestamp: new Date().toISOString() });
    } catch (error) {
      this.emit({ type: 'error', data: error, timestamp: new Date().toISOString() });
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.connectionResult) {
      throw new Error('Wallet not connected');
    }
    return this.client.signMessage(message);
  }

  async getAddress(): Promise<string> {
    if (!this.connectionResult) {
      throw new Error('Wallet not connected');
    }
    return this.client.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.connectionResult) {
      throw new Error('Wallet not connected');
    }
    return this.client.getBalance();
  }

  isConnected(): boolean {
    return this.client.isConnected();
  }

  getConnectionResult(): WalletConnectionResult | null {
    return this.connectionResult;
  }

  on(event: WalletEventHandler): () => void {
    this.listeners.add(event);
    return () => {
      this.listeners.delete(event);
    };
  }

  private emit(event: WalletEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch {
        // silently fail
      }
    });
  }
}