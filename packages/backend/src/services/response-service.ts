import { v4 as uuidv4 } from 'uuid';
import type { SurveyResponse, Answer, ResponseStatus } from '@midnight-survey/shared';
import { ValidationError } from '@midnight-survey/shared';
import { surveyService } from './survey-service.js';

const responses = new Map<string, SurveyResponse>();
const nullifiers = new Set<string>();

export const responseService = {
  async submit(input: { surveyId: string; answers: Omit<Answer, 'timestamp'>[]; respondentId?: string; respondentHash?: string }): Promise<SurveyResponse> {
    const survey = await surveyService.getById(input.surveyId);
    if (survey.status !== 'published') throw new ValidationError('Survey is not accepting responses');

    const key = input.respondentHash ?? input.respondentId ?? uuidv4();
    const nullifier = `${survey.id}:${key}`;
    if (nullifiers.has(nullifier)) throw new ValidationError('You have already submitted a response');
    nullifiers.add(nullifier);

    const id = uuidv4();
    const now = new Date().toISOString();
    const response: SurveyResponse = {
      id, surveyId: input.surveyId,
      respondentId: input.respondentId,
      respondentHash: input.respondentHash,
      answers: input.answers.map(a => ({ ...a, timestamp: now })),
      metadata: { startedAt: now, submittedAt: now, completedAt: now, durationSeconds: 0 },
      status: 'completed' as ResponseStatus,
      version: 1,
    };
    responses.set(id, response);
    return response;
  },

  async getBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    return Array.from(responses.values()).filter(r => r.surveyId === surveyId);
  },

  async getAnalytics(surveyId: string) {
    const surveyResponses = await this.getBySurvey(surveyId);
    const completed = surveyResponses.filter(r => r.status === 'completed');
    const byDate = new Map<string, number>();
    const byStatus: Record<string, number> = {};
    surveyResponses.forEach(r => {
      const date = r.metadata.submittedAt?.slice(0, 10) ?? 'unknown';
      byDate.set(date, (byDate.get(date) ?? 0) + 1);
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    });

    return {
      surveyId,
      totalResponses: surveyResponses.length,
      completionRate: surveyResponses.length > 0 ? completed.length / surveyResponses.length : 0,
      responsesByDate: Array.from(byDate.entries()).map(([date, count]) => ({ date, count })),
      responsesByStatus: byStatus,
      questionAnalytics: [],
    };
  },
};
