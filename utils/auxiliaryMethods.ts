export const convertToSnakeCase = (word: string): string => {
    if(/[A-Z]/.test(word)) {
        const result = word.match(/[A-Z]/g);
        const uppercaseLetter = result[0];

        return uppercaseLetter === "C"
            ? word.replace(/C/, `_${uppercaseLetter.toLowerCase()}`)
            : word.replace(/T/, `_${uppercaseLetter.toLowerCase()}`);
    }
    return word;
}