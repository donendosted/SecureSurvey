import { describe, it, expect } from 'vitest';

describe('Shared Types', () => {
  it('should export all type categories', () => {
    const types = require('./index');
    expect(types.QuestionType).toBeDefined();
    expect(types.SurveyStatus).toBeDefined();
    expect(types.ResponseStatus).toBeDefined();
    expect(types.UserRole).toBeDefined();
    expect(types.AppError).toBeDefined();
    expect(types.ValidationError).toBeDefined();
    expect(types.AuthenticationError).toBeDefined();
    expect(types.NotFoundError).toBeDefined();
  });

  it('should create custom errors', () => {
    const err = new types.ValidationError('Invalid input');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid input');
  });
});
