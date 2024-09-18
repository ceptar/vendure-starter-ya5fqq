import { PasswordHashingStrategy } from '@vendure/core';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Use bcrypt-js rather than the default bcrypt, because Stackblitz cannot handle the
 * native module version.
 */
export class BcryptJSPasswordHashingStrategy
  implements PasswordHashingStrategy
{
  hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
  }

  check(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
