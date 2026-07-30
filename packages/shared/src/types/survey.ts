export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT_SHORT = 'text_short',
  TEXT_LONG = 'text_long',
  RATING = 'rating',
  SCALE = 'scale',
  RANKING = 'ranking',
  DATE = 'date',
  FILE_UPLOAD = 'file_upload',
  YES_NO = 'yes_no',
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

export enum SurveyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export interface SurveySettings {
  allowAnonymous: boolean;
  requireAuth: boolean;
  allowMultipleResponses: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showProgressBar: boolean;
  showQuestionNumbers: boolean;
  confirmationMessage?: string;
  maxResponses?: number;
  startDate?: string;
  endDate?: string;
}

export interface SurveyMetadata {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
  tags: string[];
  language: string;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  version: number;
  status: SurveyStatus;
  settings: SurveySettings;
  questions: Question[];
  metadata: SurveyMetadata;
}
