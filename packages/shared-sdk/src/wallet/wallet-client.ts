import { connectWallet } from '@midnight-ntwrk/midnight-js-wallet-api';
import { getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { SDKConfig, WalletConnectionResult } from '../types';

export class WalletClient {
  private config: SDKConfig;
  private wallet: any = null;

  constructor(config: SDKConfig) {
    this.config = config;
  }

  async connect(): Promise<WalletConnectionResult> {
    const networkId = getNetworkId(this.config.ledger.network);

    this.wallet = await connectWallet({
      networkId,
      nodeUrl: this.config.ledger.nodeUrl,
      ...(this.config.ledger.walletConnectProjectId && {
        walletConnectProjectId: this.config.ledger.walletConnectProjectId,
      }),
    });

    const address = await this.wallet.getAddress();
    const publicKey = await this.wallet.getPublicKey();
    const balance = await this.wallet.getBalance();

    return {
      address,
      publicKey,
      balance: balance.toString(),
    };
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }
    return this.wallet.signMessage(message);
  }

  async getAddress(): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }
    return this.wallet.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }
    const balance = await this.wallet.getBalance();
    return balance.toString();
  }

  isConnected(): boolean {
    return this.wallet !== null;
  }
}