import * as crypto from 'crypto';

export function serializeAnswers(answers: Record<string, unknown>): string {
  return JSON.stringify(answers, Object.keys(answers).sort());
}

export function deserializeAnswers(data: string): Record<string, unknown> {
  return JSON.parse(data);
}

export function hashAnswers(answers: Record<string, unknown>): string {
  const serialized = serializeAnswers(answers);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

export function nullifierHash(respondentKey: string, surveyId: string): string {
  return crypto
    .createHash('sha256')
    .update(respondentKey + surveyId + 'nullifier')
    .digest('hex');
}

export function respondentHash(walletAddress: string, salt?: string): string {
  return crypto
    .createHash('sha256')
    .update(walletAddress + (salt ?? ''))
    .digest('hex');
}