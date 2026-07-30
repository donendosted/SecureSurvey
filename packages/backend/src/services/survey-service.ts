import { v4 as uuidv4 } from 'uuid';
import type {
  Survey, SurveyCreateInput, SurveyUpdateInput,
  Question, QuestionType, SurveyStatus, SurveySettings, SurveyMetadata
} from '@midnight-survey/shared-types';
import { NotFoundError, ValidationError, AuthorizationError } from '@midnight-survey/shared-types';

const surveys = new Map<string, Survey>();

export class SurveyService {
  async create(input: SurveyCreateInput, userId: string): Promise<Survey> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const survey: Survey = {
      id,
      title: input.title,
      description: input.description,
      descriptionRich: input.descriptionRich,
      version: 1,
      status: 'draft' as SurveyStatus,
      settings: {
        allowAnonymous: true,
        requireAuth: false,
        allowMultipleResponses: false,
        collectEmail: false,
        collectMetadata: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        showProgressBar: true,
        showQuestionNumbers: true,
        ...input.settings,
      } as SurveySettings,
      questions: input.questions.map((q, idx) => ({
        ...q,
        id: uuidv4(),
        order: idx + 1,
      })) as Question[],
      metadata: {
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        tags: [],
        language: 'en',
        ...input.metadata,
      } as SurveyMetadata,
    };
    surveys.set(id, survey);
    return survey;
  }

  async getById(id: string): Promise<Survey> {
    const survey = surveys.get(id);
    if (!survey) throw new NotFoundError('Survey', id);
    return survey;
  }

  async update(id: string, input: SurveyUpdateInput, userId: string): Promise<Survey> {
    const survey = await this.getById(id);
    if (survey.metadata.createdBy !== userId) throw new AuthorizationError('Not the survey owner');

    const now = new Date().toISOString();
    const updated: Survey = {
      ...survey,
      ...input,
      version: survey.version + 1,
      metadata: { ...survey.metadata, updatedAt: now },
    };
    surveys.set(id, updated);
    return updated;
  }

  async publish(id: string, userId: string): Promise<Survey> {
    const survey = await this.getById(id);
    if (survey.metadata.createdBy !== userId) throw new AuthorizationError('Not the survey owner');
    if (survey.status !== 'draft') throw new ValidationError('Survey must be in draft status');

    const now = new Date().toISOString();
    const updated: Survey = {
      ...survey,
      status: 'published' as SurveyStatus,
      metadata: { ...survey.metadata, publishedAt: now, updatedAt: now },
    };
    surveys.set(id, updated);
    return updated;
  }

  async close(id: string, userId: string): Promise<Survey> {
    const survey = await this.getById(id);
    if (survey.metadata.createdBy !== userId) throw new AuthorizationError('Not the survey owner');
    if (survey.status !== 'published') throw new ValidationError('Survey must be published');

    const now = new Date().toISOString();
    const updated: Survey = {
      ...survey,
      status: 'closed' as SurveyStatus,
      metadata: { ...survey.metadata, closedAt: now, updatedAt: now },
    };
    surveys.set(id, updated);
    return updated;
  }

  async list(params: {
    page?: number; limit?: number; status?: SurveyStatus; userId?: string; search?: string;
  }): Promise<{ items: Survey[]; total: number }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    let items = Array.from(surveys.values());

    if (params.status) items = items.filter(s => s.status === params.status);
    if (params.userId) items = items.filter(s => s.metadata.createdBy === params.userId);
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(s => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }

    items.sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime());
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  }

  async delete(id: string, userId: string): Promise<void> {
    const survey = await this.getById(id);
    if (survey.metadata.createdBy !== userId) throw new AuthorizationError('Not the survey owner');
    surveys.delete(id);
  }
}

export const surveyService = new SurveyService();
