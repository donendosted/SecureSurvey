import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  midnight: {
    network: process.env.MIDNIGHT_NETWORK ?? 'testnet',
    nodeUrl: process.env.MIDNIGHT_NODE_URL ?? 'https://rpc.devnet.midnight.network',
    indexerUrl: process.env.MIDNIGHT_INDEXER_URL,
    proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL,
    surveyRegistryAddress: process.env.MIDNIGHT_SURVEY_REGISTRY_ADDRESS ?? '',
    responseRegistryAddress: process.env.MIDNIGHT_RESPONSE_REGISTRY_ADDRESS ?? '',
    zkVerifierAddress: process.env.MIDNIGHT_ZK_VERIFIER_ADDRESS ?? '',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY ?? 'dev-encryption-key-32-chars-long!',
  },
  logLevel: process.env.LOG_LEVEL ?? 'dev',
};
