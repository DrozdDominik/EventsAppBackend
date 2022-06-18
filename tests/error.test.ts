import { describe, it, expect } from "vitest";
import { AppError } from "../utils/error";

describe('class AppError', () => {
    it('should contain the provided message and status code', () => {
        const testStatusCode = 200;
        const testMessage = "Test error message."

        const testError = new AppError(testMessage, testStatusCode);

        expect(testError.statusCode).toBe(testStatusCode);
        expect(testError.message).toBe(testMessage);
    });
});