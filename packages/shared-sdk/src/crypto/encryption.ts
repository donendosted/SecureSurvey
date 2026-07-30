import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export class EncryptionService {
  private key: Buffer;

  constructor(key?: string) {
    if (key) {
      this.key = Buffer.from(key, 'hex');
    } else {
      this.key = crypto.randomBytes(KEY_LENGTH);
    }
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0]!, 'hex');
    const authTag = Buffer.from(parts[1]!, 'hex');
    const encrypted = parts[2]!;

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  hashWithSalt(data: string, salt: string): string {
    return crypto.createHash('sha256').update(data + salt).digest('hex');
  }

  generateNullifier(respondentKey: string, surveyId: string): string {
    return crypto
      .createHash('sha256')
      .update(respondentKey + surveyId + 'nullifier')
      .digest('hex');
  }

  generateCommitment(respondentKey: string, nullifier: string): string {
    return crypto
      .createHash('sha256')
      .update(respondentKey + nullifier + 'commitment')
      .digest('hex');
  }

  getPublicKey(): string {
    return this.key.toString('hex');
  }
}