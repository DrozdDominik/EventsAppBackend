import { it, expect } from 'vitest';
import { convertCamelCaseToSnakeCase } from '../utils/auxiliaryMethods';

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