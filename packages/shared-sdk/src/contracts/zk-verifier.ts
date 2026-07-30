import { createContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { SDKConfig } from '../types';

export interface ZKVerificationOutput {
  verified: boolean;
  publicInputs: string[];
  verifierAddress?: string;
  verifiedAt?: string;
}

export class ZKVerifierClient {
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
  }

  async verifyProof(
    proof: string,
    publicInputs: string[],
    verificationKey: string
  ): Promise<ZKVerificationOutput> {
    const contract = await createContract(this.config.contractAddresses.zkVerifier, {
      args: [proof, ...publicInputs, verificationKey],
    });
    return {
      verified: (contract.state as { verified: boolean }).verified,
      publicInputs,
      verifierAddress: this.config.contractAddresses.zkVerifier,
      verifiedAt: new Date().toISOString(),
    };
  }

  async verifyResponseIntegrity(
    answersHash: string,
    nullifierHash: string,
    proof: string
  ): Promise<boolean> {
    const contract = await createContract(this.config.contractAddresses.zkVerifier, {
      args: [proof, answersHash, nullifierHash],
    });
    return (contract.state as { verified: boolean }).verified;
  }

  async verifyNullifierUniqueness(
    nullifierHash: string,
    surveyId: string,
    proof: string
  ): Promise<boolean> {
    const contract = await createContract(this.config.contractAddresses.zkVerifier, {
      args: [proof, nullifierHash, surveyId],
    });
    return (contract.state as { verified: boolean }).verified;
  }
}