export enum SDKErrorCode {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  PROOF_GENERATION_FAILED = 'PROOF_GENERATION_FAILED',
  PROOF_VERIFICATION_FAILED = 'PROOF_VERIFICATION_FAILED',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  INVALID_CONFIG = 'INVALID_CONFIG',
  DUPLICATE_RESPONSE = 'DUPLICATE_RESPONSE',
  SURVEY_CLOSED = 'SURVEY_CLOSED',
  SURVEY_NOT_FOUND = 'SURVEY_NOT_FOUND',
  RESPONSE_NOT_FOUND = 'RESPONSE_NOT_FOUND',
  MERKLE_PROOF_ERROR = 'MERKLE_PROOF_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class SDKError extends Error {
  constructor(
    public readonly code: SDKErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

export function isSDKError(error: unknown): error is SDKError {
  return error instanceof SDKError;
}

export function handleSDKError(error: unknown): SDKError {
  if (isSDKError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new SDKError(SDKErrorCode.UNKNOWN_ERROR, error.message, { originalError: error.message });
  }

  return new SDKError(SDKErrorCode.UNKNOWN_ERROR, 'An unexpected error occurred');
}