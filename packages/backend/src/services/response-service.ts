import { v4 as uuidv4 } from 'uuid';
import type { Survey, Response, Answer, ResponseStatus } from '@midnight-survey/shared-types';
import { surveyService } from './survey-service';
import { ValidationError } from '@midnight-survey/shared-types';

const responses = new Map<string, Response>();
const nullifiers = new Set<string>();

export class ResponseService {
  async submit(input: {
    surveyId: string; answers: Omit<Answer, 'timestamp'>[]; respondentId?: string; respondentHash?: string;
  }): Promise<Response> {
    const survey = await surveyService.getById(input.surveyId);
    if (survey.status !== 'published') throw new ValidationError('Survey is not accepting responses');

    const respondentKey = input.respondentHash ?? input.respondentId ?? uuidv4();
    const nullifier = `${survey.id}:${respondentKey}`;
    if (nullifiers.has(nullifier)) throw new ValidationError('You have already submitted a response to this survey');
    nullifiers.add(nullifier);

    const id = uuidv4();
    const now = new Date().toISOString();
    const response: Response = {
      id,
      surveyId: input.surveyId,
      respondentId: input.respondentId,
      respondentHash: input.respondentHash,
      answers: input.answers.map(a => ({ ...a, timestamp: now })),
      metadata: {
        startedAt: now,
        submittedAt: now,
        completedAt: now,
        durationSeconds: 0,
      },
      status: 'completed' as ResponseStatus,
      version: 1,
    };
    responses.set(id, response);
    return response;
  }

  async getById(id: string): Promise<Response> {
    const response = responses.get(id);
    if (!response) throw new ValidationError('Response not found');
    return response;
  }

  async getBySurvey(surveyId: string): Promise<Response[]> {
    return Array.from(responses.values()).filter(r => r.surveyId === surveyId);
  }

  async getAnalytics(surveyId: string) {
    const surveyResponses = await this.getBySurvey(surveyId);
    const totalResponses = surveyResponses.length;
    const completed = surveyResponses.filter(r => r.status === 'completed');

    return {
      surveyId,
      totalResponses,
      completionRate: totalResponses > 0 ? completed.length / totalResponses : 0,
      responsesByDate: this.groupByDate(surveyResponses),
      responsesByStatus: this.groupByStatus(surveyResponses),
    };
  }

  private groupByDate(responses: Response[]): Array<{ date: string; count: number }> {
    const map = new Map<string, number>();
    responses.forEach(r => {
      const date = r.metadata.submittedAt?.slice(0, 10) ?? 'unknown';
      map.set(date, (map.get(date) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  }

  private groupByStatus(responses: Response[]): Record<string, number> {
    const map: Record<string, number> = {};
    responses.forEach(r => { map[r.status] = (map[r.status] ?? 0) + 1; });
    return map;
  }
}

export const responseService = new ResponseService();
