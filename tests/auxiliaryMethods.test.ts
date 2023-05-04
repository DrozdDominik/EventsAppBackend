import { it, expect, describe } from 'vitest';
import {
  convertCamelCaseToSnakeCase,
  convertSnakeCaseToCamelCase,
  isDateValid,
  isEmailValid,
  isLinkValid,
  isPasswordValid,
  isTimeValid,
} from '../utils/auxiliaryMethods';

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

describe('convertSnakeCaseToCamelCase()', () => {
  it('should convert snake_case string to camelCase string.', () => {
    const testString = 'estimated_time';

    const result = convertSnakeCaseToCamelCase(testString);

    expect(result).toBe('estimatedTime');
  });

  it('should not change string without underscore', () => {
    const testString = 'description';

    const result = convertSnakeCaseToCamelCase(testString);

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

describe('isLinkValid()', () => {
  it('should returns false if provided not valid protocol', () => {
    const notValidLink = 'htp://example.com';

    const result = isLinkValid(notValidLink);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid link', () => {
    const validLink = 'https://example.com';

    const result = isLinkValid(validLink);

    expect(result).toBe(true);
  });
});

describe('isDateValid()', () => {
  it('should returns false if provided not valid date', () => {
    const notValidDate = '2023-02-30';

    const result = isDateValid(notValidDate);

    expect(result).toBe(false);
  });

  it('should returns false if provided not valid month', () => {
    const notValidDate = '2023-14-29';

    const result = isDateValid(notValidDate);

    expect(result).toBe(false);
  });

  it('should returns false if provided not valid day', () => {
    const notValidDate = '2023-05-32';

    const result = isDateValid(notValidDate);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid date', () => {
    const validDate = '2023-05-31';

    const result = isDateValid(validDate);

    expect(result).toBe(true);
  });
});

describe('isTimeValid()', () => {
  it('should returns false if provided not valid time', () => {
    const notValidTime = '21.11';

    const result = isTimeValid(notValidTime);

    expect(result).toBe(false);
  });

  it('should returns false if provided not valid hour', () => {
    const notValidTime = '25:11';

    const result = isTimeValid(notValidTime);

    expect(result).toBe(false);
  });

  it('should returns false if provided not valid minutes', () => {
    const notValidTime = '11:61';

    const result = isTimeValid(notValidTime);

    expect(result).toBe(false);
  });

  it('should returns true if provided valid time', () => {
    const validTime = '22:11';

    const result = isTimeValid(validTime);

    expect(result).toBe(true);
  });
});
