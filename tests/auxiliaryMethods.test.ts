import { it, expect, describe } from 'vitest';
import { convertCamelCaseToSnakeCase, isEmailValid, isPasswordValid } from '../utils/auxiliaryMethods';

describe('convertCamelCaseToSnakeCase()', () => {
  it('should convert caseCase string to snake_case string.', () => {
    const testString = 'estimatedTime';

    const result = convertCamelCaseToSnakeCase(testString);

    expect(result).toBe('estimated_time');
  });

  it('should not change string without upperCase', () => {
    const testString = 'description';

    const result = convertCamelCaseToSnakeCase(testString);

    expect(result).toBe(testString);
  });
});

describe('isEmailValid()', () => {
  it('should returns false if provided not valid email', () => {
    const notValidEmail = 'test.pl';

    const result = isEmailValid(notValidEmail);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid email', () => {
    const validEmail = 'test@example.pl';

    const result = isEmailValid(validEmail);

    expect(result).toBe(true);
  });
});

describe('isPasswordValid()', () => {
  it('should returns false if provided password is to short', () => {
    const notValidPassword = '123456';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns false if provided password has no digits', () => {
    const notValidPassword = 'qwertyui*';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns false if provided password has no special character', () => {
    const notValidPassword = 'qwertyui5';

    const result = isPasswordValid(notValidPassword);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid password', () => {
    const validEmail = 'asdf1uuah&hy';

    const result = isPasswordValid(validEmail);

    expect(result).toBe(true);
  });
});