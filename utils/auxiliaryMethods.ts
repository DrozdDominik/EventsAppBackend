import * as crypto from 'crypto';
import { config } from '../config/config';

export const convertCamelCaseToSnakeCase = (word: string): string =>
  word
    .split('')
    .map(letter => (/[A-Z]/.test(letter) ? `_${letter.toLowerCase()}` : letter))
    .join('');

export const convertSnakeCaseToCamelCase = (word: string): string => {
  let camelCaseWord = '';
  let currentWordLength = word.length;

  for (let i = 0; i < currentWordLength; i++) {
    if (word[i] === '_') {
      camelCaseWord += word[i + 1].toUpperCase();
      i++;
    } else {
      camelCaseWord += word[i];
    }
  }
  return camelCaseWord;
};

export const isEmailValid = (email: string): boolean =>
  /^[a-zA-Z\d.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*$/.test(
    email,
  );

export const isPasswordValid = (password: string): boolean =>
  /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{7,15}$/.test(password);

export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac('sha512', config.passwordSalt);
  hmac.update(password);
  return hmac.digest('hex');
};

export const isLinkValid = (link: string): boolean => {
  let url;
  try {
    url = new URL(link);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

const daysInMonth = (month: number, year: number) => {
  switch (month) {
    case 2:
      return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
    case 9:
    case 4:
    case 6:
    case 11:
      return 30;
    default:
      return 31;
  }
};

export const isDateValid = (date: string) => {
  const data = date.split('-');
  const year = Number(data[0]);
  const month = Number(data[1]);
  const day = Number(data[2]);

  return month >= 1 && month < 13 && day > 0 && day <= daysInMonth(month, year);
};
