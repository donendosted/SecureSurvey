import type { Survey, SurveyStatus } from '../../types/index.js';

export class SurveyRegistry {
  async createSurvey(input: {
    id: string; title: string; questionsHash: string; owner: string
  }): Promise<Survey> {
    const survey: Survey = {
      id: input.id,
      title: input.title,
      version: 1,
      status: 'draft' as SurveyStatus,
      settings: {
        allowAnonymous: true,
        requireAuth: false,
        allowMultipleResponses: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        showProgressBar: true,
        showQuestionNumbers: true,
      },
      questions: [],
      metadata: {
        createdBy: input.owner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        language: 'en',
      },
    };
    return survey;
  }

  async publishSurvey(surveyId: string, owner: string): Promise<void> {}

  async closeSurvey(surveyId: string, owner: string): Promise<void> {}

  async getResponseCount(surveyId: string): Promise<number> {
    return 0;
  }
}
