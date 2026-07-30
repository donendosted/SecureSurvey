import { createContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { SDKConfig } from '../types';
import type { SurveyContractState } from '../types';

export class SurveyRegistryClient {
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
  }

  async createSurvey(
    surveyId: string,
    title: string,
    questionsHash: string,
    owner: string
  ): Promise<SurveyContractState> {
    const contract = await createContract(this.config.contractAddresses.surveyRegistry, {
      args: [surveyId, title, questionsHash, owner],
    });
    return contract.state as SurveyContractState;
  }

  async updateSurvey(
    surveyId: string,
    title: string,
    questionsHash: string,
    version: number
  ): Promise<SurveyContractState> {
    const contract = await createContract(this.config.contractAddresses.surveyRegistry, {
      args: [surveyId, title, questionsHash, version],
    });
    return contract.state as SurveyContractState;
  }

  async publishSurvey(surveyId: string, owner: string): Promise<SurveyContractState> {
    const contract = await createContract(this.config.contractAddresses.surveyRegistry, {
      args: [surveyId, 'publish', owner],
    });
    return contract.state as SurveyContractState;
  }

  async closeSurvey(surveyId: string, owner: string): Promise<SurveyContractState> {
    const contract = await createContract(this.config.contractAddresses.surveyRegistry, {
      args: [surveyId, 'close', owner],
    });
    return contract.state as SurveyContractState;
  }

  async getSurvey(surveyId: string): Promise<SurveyContractState | null> {
    try {
      const contract = await createContract(this.config.contractAddresses.surveyRegistry, {
        args: [surveyId],
      });
      return contract.state as SurveyContractState;
    } catch {
      return null;
    }
  }

  async getResponseCount(surveyId: string): Promise<number> {
    const survey = await this.getSurvey(surveyId);
    return survey?.responseCount ?? 0;
  }

  async verifyOwnership(surveyId: string, address: string): Promise<boolean> {
    const survey = await this.getSurvey(surveyId);
    return survey?.owner === address;
  }
}