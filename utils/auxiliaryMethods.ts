export const convertCamelCaseToSnakeCase = (word: string): string => word.split('')
  .map(letter => /[A-Z]/.test(letter) ? `_${letter.toLowerCase()}` : letter)
  .join('');

