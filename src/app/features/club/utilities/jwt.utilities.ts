import crypto from 'crypto-js';
import { Token } from '../models/club.model';

export class JwtUtilities {
  static sign<T extends Record<string, string>>(payload: T, secret: string): string {
    return crypto.AES.encrypt(
      JSON.stringify({
        ...payload,
        exp: Date.now() + 3_600_000 * 24, // 1 days
      }),
      secret
    ).toString();
  }

  static decode(token: string, secret: string): Token {
    const decodeBytes = crypto.AES.decrypt(token, secret);
    return JSON.parse(decodeBytes.toString(crypto.enc.Utf8));
  }
}