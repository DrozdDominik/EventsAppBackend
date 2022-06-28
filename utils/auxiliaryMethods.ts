import * as crypto from 'crypto';
import { config } from '../config/config';

export const convertCamelCaseToSnakeCase = (word: string): string => word.split('')
  .map(letter => /[A-Z]/.test(letter) ? `_${letter.toLowerCase()}` : letter)
  .join('');

export const isEmailValid = (email: string): boolean => (/^[a-zA-Z\d.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/).test(email);

export const isPasswordValid = (password: string): boolean => (/^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{7,15}$/).test(password);

export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac('sha512', config.passwordSalt);
  hmac.update(password);
  return hmac.digest('hex');
};
