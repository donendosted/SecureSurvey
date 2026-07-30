import { createContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { SDKConfig, ResponseContractState } from '../types';

export class ResponseRegistryClient {
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
  }

  async submitResponse(
    surveyId: string,
    nullifierHash: string,
    respondentHash: string,
    answersHash: string,
    zkProof: string
  ): Promise<ResponseContractState> {
    const contract = await createContract(this.config.contractAddresses.responseRegistry, {
      args: [surveyId, nullifierHash, respondentHash, answersHash, zkProof],
    });
    return contract.state as ResponseContractState;
  }

  async getResponse(responseId: string): Promise<ResponseContractState | null> {
    try {
      const contract = await createContract(this.config.contractAddresses.responseRegistry, {
        args: [responseId],
      });
      return contract.state as ResponseContractState;
    } catch {
      return null;
    }
  }

  async getResponseByNullifier(nullifierHash: string): Promise<ResponseContractState | null> {
    try {
      const contract = await createContract(this.config.contractAddresses.responseRegistry, {
        args: ['nullifier', nullifierHash],
      });
      return contract.state as ResponseContractState;
    } catch {
      return null;
    }
  }

  async verifyResponse(responseId: string): Promise<boolean> {
    const response = await this.getResponse(responseId);
    return response?.verified ?? false;
  }

  async hasResponded(surveyId: string, nullifierHash: string): Promise<boolean> {
    const existing = await this.getResponseByNullifier(nullifierHash);
    return existing !== null && existing.surveyId === surveyId;
  }
}