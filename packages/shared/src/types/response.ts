export interface Answer {
  questionId: string;
  value: string | number | boolean | string[] | null;
  timestamp: string;
}

export interface ResponseMetadata {
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
}

export enum ResponseStatus {
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId?: string;
  respondentHash?: string;
  answers: Answer[];
  metadata: ResponseMetadata;
  zkProof?: ZKProof;
  status: ResponseStatus;
  version: number;
}

export interface ZKProof {
  proof: string;
  publicInputs: string[];
  verificationKey: string;
  circuitId: string;
  timestamp: string;
}

import type { QuestionType } from './survey.js';

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  responsesByDate: Array<{ date: string; count: number }>;
  responsesByStatus: Record<string, number>;
  questionAnalytics: Array<{
    questionId: string;
    questionTitle: string;
    questionType: QuestionType;
    totalAnswers: number;
    skipRate: number;
    distribution: Record<string, number>;
  }>;
}
