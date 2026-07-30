import type { SDKConfig } from './types';

const DEFAULT_CONFIG: Partial<SDKConfig> = {
  ledger: {
    network: 'testnet',
    nodeUrl: 'https://rpc.devnet.midnight.network',
    indexerUrl: 'https://indexer.devnet.midnight.network',
    proofServerUrl: 'https://prover.devnet.midnight.network',
  },
  contractAddresses: {
    surveyRegistry: '',
    responseRegistry: '',
    zkVerifier: '',
  },
  circuitPaths: {
    surveyRegistry: './circuits/survey-registry',
    responseRegistry: './circuits/response-registry',
    zkVerifier: './circuits/zk-verifier',
  },
};

export function getSDKConfig(overrides?: Partial<SDKConfig>): SDKConfig {
  const envConfig: Partial<SDKConfig> = {
    ledger: {
      network: (process.env.MIDNIGHT_NETWORK as SDKConfig['ledger']['network']) || 'testnet',
      nodeUrl: process.env.MIDNIGHT_NODE_URL || 'https://rpc.devnet.midnight.network',
      indexerUrl: process.env.MIDNIGHT_INDEXER_URL,
      proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL,
    },
    contractAddresses: {
      surveyRegistry: process.env.MIDNIGHT_SURVEY_REGISTRY_ADDRESS || '',
      responseRegistry: process.env.MIDNIGHT_RESPONSE_REGISTRY_ADDRESS || '',
      zkVerifier: process.env.MIDNIGHT_ZK_VERIFIER_ADDRESS || '',
    },
    privateKey: process.env.MIDNIGHT_PRIVATE_KEY,
  };

  return {
    ...DEFAULT_CONFIG,
    ...envConfig,
    ...overrides,
    ledger: { ...DEFAULT_CONFIG.ledger, ...envConfig.ledger, ...overrides?.ledger },
    contractAddresses: {
      ...DEFAULT_CONFIG.contractAddresses,
      ...envConfig.contractAddresses,
      ...overrides?.contractAddresses,
    },
    circuitPaths: {
      ...DEFAULT_CONFIG.circuitPaths,
      ...overrides?.circuitPaths,
    },
  };
}

export function validateSDKConfig(config: SDKConfig): void {
  const missing: string[] = [];

  if (!config.ledger.nodeUrl) missing.push('ledger.nodeUrl');
  if (!config.contractAddresses.surveyRegistry) missing.push('contractAddresses.surveyRegistry');
  if (!config.contractAddresses.responseRegistry) missing.push('contractAddresses.responseRegistry');
  if (!config.contractAddresses.zkVerifier) missing.push('contractAddresses.zkVerifier');

  if (missing.length > 0) {
    throw new Error(`SDK configuration is incomplete. Missing: ${missing.join(', ')}`);
  }
}