import type { MidnightNetwork } from '@midnight-survey/shared-types';

/**
 * Midnight Network configuration
 */
export interface MidnightLedgerConfig {
  network: MidnightNetwork;
  nodeUrl: string;
  indexerUrl?: string;
  proofServerUrl?: string;
  walletConnectProjectId?: string;
}

/**
 * Contract addresses on the Midnight network
 */
export interface ContractAddresses {
  surveyRegistry: string;
  responseRegistry: string;
  zkVerifier: string;
  tokenContract?: string;
}

/**
 * Circuit file paths
 */
export interface CircuitPaths {
  surveyRegistry: string;
  responseRegistry: string;
  zkVerifier: string;
}

/**
 * Full SDK configuration
 */
export interface SDKConfig {
  ledger: MidnightLedgerConfig;
  contractAddresses: ContractAddresses;
  circuitPaths: CircuitPaths;
  privateKey?: string;
}

/**
 * Wallet connection result
 */
export interface WalletConnectionResult {
  address: string;
  publicKey: string;
  midnightAddress?: string;
  balance: string;
}

/**
 * Contract deployment result
 */
export interface ContractDeploymentResult {
  address: string;
  contractId: string;
  transactionHash: string;
  blockNumber: number;
}

/**
 * Survey contract state
 */
export interface SurveyContractState {
  id: string;
  title: string;
  description?: string;
  questionsHash: string;
  status: string;
  responseCount: number;
  owner: string;
  createdAt: number;
}

/**
 * Response contract state
 */
export interface ResponseContractState {
  id: string;
  surveyId: string;
  nullifierHash: string;
  respondentHash: string;
  answersHash: string;
  zkProof: string;
  submittedAt: number;
  verified: boolean;
}