import * as crypto from 'crypto';

export class Encryption {
  private key: Buffer;

  constructor(key?: string) {
    this.key = key
      ? Buffer.from(key, 'hex')
      : crypto.randomBytes(32);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [iv, authTag, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(iv!, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag!, 'hex'));
    let decrypted = decipher.update(encrypted!, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateNullifier(respondentKey: string, surveyId: string): string {
    return this.hash(`${respondentKey}:${surveyId}:nullifier`);
  }
}
