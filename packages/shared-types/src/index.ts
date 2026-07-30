// Survey Types

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

export interface QuestionBase {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: QuestionType.SINGLE_CHOICE;
  options: string[];
  allowOther?: boolean;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: QuestionType.MULTIPLE_CHOICE;
  options: string[];
  minSelections?: number;
  maxSelections?: number;
  allowOther?: boolean;
}

export interface TextShortQuestion extends QuestionBase {
  type: QuestionType.TEXT_SHORT;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface TextLongQuestion extends QuestionBase {
  type: QuestionType.TEXT_LONG;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface RatingQuestion extends QuestionBase {
  type: QuestionType.RATING;
  maxRating: number;
  labels?: Record<number, string>;
}

export interface ScaleQuestion extends QuestionBase {
  type: QuestionType.SCALE;
  minValue: number;
  maxValue: number;
  step: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface RankingQuestion extends QuestionBase {
  type: QuestionType.RANKING;
  items: string[];
  maxRank?: number;
}

export interface DateQuestion extends QuestionBase {
  type: QuestionType.DATE;
  minDate?: string;
  maxDate?: string;
}

export interface FileUploadQuestion extends QuestionBase {
  type: QuestionType.FILE_UPLOAD;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export interface YesNoQuestion extends QuestionBase {
  type: QuestionType.YES_NO;
  yesLabel?: string;
  noLabel?: string;
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TextShortQuestion
  | TextLongQuestion
  | RatingQuestion
  | ScaleQuestion
  | RankingQuestion
  | DateQuestion
  | FileUploadQuestion
  | YesNoQuestion;

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  minSelections?: number;
  maxSelections?: number;
}

export interface ConditionalLogic {
  showIf: {
    questionId: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
    value: string | number | boolean;
  };
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
  collectEmail: boolean;
  collectMetadata: boolean;
  startDate?: string;
  endDate?: string;
  maxResponses?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showProgressBar: boolean;
  showQuestionNumbers: boolean;
  confirmationMessage?: string;
  redirectUrl?: string;
  password?: string;
  expiresAfter?: number;
}

export interface SurveyTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  customCss?: string;
}

export interface SurveyMetadata {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  closedAt?: string;
  tags: string[];
  category?: string;
  language: string;
  estimatedTimeMinutes?: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  descriptionRich?: string;
  version: number;
  status: SurveyStatus;
  settings: SurveySettings;
  questions: Question[];
  theme?: SurveyTheme;
  metadata: SurveyMetadata;
  settingsHash?: string;
  questionsHash?: string;
}

export interface SurveyCreateInput {
  title: string;
  description?: string;
  descriptionRich?: string;
  settings?: Partial<SurveySettings>;
  questions: Omit<Question, 'id' | 'order'>[];
  theme?: SurveyTheme;
  metadata?: Partial<Omit<SurveyMetadata, 'createdBy' | 'createdAt' | 'updatedAt'>>;
}

export interface SurveyUpdateInput {
  id: string;
  version: number;
  title?: string;
  description?: string;
  descriptionRich?: string;
  settings?: Partial<SurveySettings>;
  questions?: Question[];
  theme?: SurveyTheme;
  metadata?: Partial<SurveyMetadata>;
}

// Response Types

export interface AnswerBase {
  questionId: string;
  timestamp: string;
}

export interface SingleChoiceAnswer extends AnswerBase {
  value: string;
}

export interface MultipleChoiceAnswer extends AnswerBase {
  value: string[];
}

export interface TextAnswer extends AnswerBase {
  value: string;
}

export interface RatingAnswer extends AnswerBase {
  value: number;
}

export interface ScaleAnswer extends AnswerBase {
  value: number;
}

export interface RankingAnswer extends AnswerBase {
  value: string[];
}

export interface DateAnswer extends AnswerBase {
  value: string;
}

export interface FileUploadAnswer extends AnswerBase {
  value: string[];
}

export interface YesNoAnswer extends AnswerBase {
  value: boolean;
}

export type Answer =
  | SingleChoiceAnswer
  | MultipleChoiceAnswer
  | TextAnswer
  | RatingAnswer
  | ScaleAnswer
  | RankingAnswer
  | DateAnswer
  | FileUploadAnswer
  | YesNoAnswer;

export interface EncryptedAnswer {
  questionId: string;
  encryptedValue: string;
  zkProof?: string;
  timestamp: string;
}

export interface ResponseMetadata {
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  userAgent?: string;
  ipHash?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  durationSeconds?: number;
  completionRate?: number;
}

export enum ResponseStatus {
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  FLAGGED = 'flagged',
}

export interface Response {
  id: string;
  surveyId: string;
  respondentId?: string;
  respondentHash?: string;
  answers: Answer[];
  encryptedAnswers?: EncryptedAnswer[];
  metadata: ResponseMetadata;
  zkProof?: ZKProof;
  zkVerification?: ZKVerificationResult;
  status: ResponseStatus;
  version: number;
}

export interface ResponseCreateInput {
  surveyId: string;
  answers: Omit<Answer, 'timestamp'>[];
  respondentId?: string;
  respondentHash?: string;
}

export interface ZKProof {
  proof: string;
  publicInputs: string[];
  verificationKey: string;
  circuitId: string;
  timestamp: string;
}

export interface ZKVerificationResult {
  verified: boolean;
  verifiedAt?: string;
  verifierAddress?: string;
  circuitId: string;
  publicInputs: string[];
}

// ZK Circuit Types

export interface ZKCircuitInputs {
  surveyId: string;
  respondentHash: string;
  answersHash: string;
  nullifier: string;
  merkleRoot: string;
  merkleProof: string[];
  nullifierHash: string;
}

export interface ZKCircuitOutputs {
  nullifierHash: string;
  commitment: string;
  proof: string;
  publicInputs: string[];
}

export interface ZKCircuit {
  id: string;
  name: string;
  version: string;
  verificationKey: string;
  wasmPath: string;
  zkeyPath: string;
}

// Midnight Network Types

export type MidnightNetwork = 'mainnet' | 'testnet' | 'devnet' | 'local';

export interface MidnightConfig {
  network: MidnightNetwork;
  nodeUrl: string;
  indexerUrl?: string;
  proofServerUrl?: string;
  walletConnectProjectId?: string;
  contractAddresses: {
    surveyRegistry: string;
    responseRegistry: string;
    zkVerifier: string;
    tokenContract?: string;
  };
  circuitPaths: {
    surveyRegistry: string;
    responseRegistry: string;
    zkVerifier: string;
  };
}

export interface WalletInfo {
  address: string;
  network: MidnightNetwork;
  connected: boolean;
  balance?: string;
  midnightAddress?: string;
}

// API Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SurveyListQuery {
  page?: number;
  limit?: number;
  status?: SurveyStatus;
  createdBy?: string;
  tags?: string[];
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'responseCount';
  sortOrder?: 'asc' | 'desc';
}

export interface SurveyResponseQuery {
  page?: number;
  limit?: number;
  status?: ResponseStatus;
  startDate?: string;
  endDate?: string;
  respondentId?: string;
}

// Analytics Types

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  averageDurationSeconds?: number;
  responsesByDate: Array<{
    date: string;
    count: number;
  }>;
  responsesByStatus: Record<string, number>;
  questionAnalytics: Array<{
    questionId: string;
    questionTitle: string;
    questionType: QuestionType;
    totalAnswers: number;
    skipRate: number;
    distribution: Record<string, number>;
    averageRating?: number;
    medianRating?: number;
    stdDev?: number;
  }>;
  respondentDemographics?: {
    byCountry?: Record<string, number>;
    byDevice?: Record<string, number>;
    byBrowser?: Record<string, number>;
    byReferrer?: Record<string, number>;
  };
}

// Authentication Types

export enum UserRole {
  ADMIN = 'admin',
  CREATOR = 'creator',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  RESPONDENT = 'respondent',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: UserRole;
  midnightAddress?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

// Webhook Types

export type WebhookEvent =
  | 'survey.created'
  | 'survey.updated'
  | 'survey.published'
  | 'survey.closed'
  | 'survey.archived'
  | 'response.submitted'
  | 'response.completed'
  | 'response.flagged'
  | 'response.verified'
  | 'survey.response_limit_reached'
  | 'survey.expired';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: unknown;
  signature: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

// Error Types

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', `${resource}${id ? ` with id ${id}` : ''} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', public readonly retryAfter?: number) {
    super('RATE_LIMIT_EXCEEDED', message, 429);
    this.name = 'RateLimitError';
  }
}

export class ZKProofError extends AppError {
  constructor(message: string, public readonly circuitId?: string) {
    super('ZK_PROOF_ERROR', message, 400);
    this.name = 'ZKProofError';
  }
}

export class BlockchainError extends AppError {
  constructor(message: string, public readonly transactionHash?: string) {
    super('BLOCKCHAIN_ERROR', message, 502);
    this.name = 'BlockchainError';
  }
}

// Utility Types

export type UUID = string & { readonly __brand: unique symbol };
export type ISODateString = string & { readonly __brand: unique symbol };
export type HexString = string & { readonly __brand: unique symbol };
export type Base64String = string & { readonly __brand: unique symbol };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ApiErrorResponse = ApiResponse<never>;

export interface RequestContext {
  requestId: string;
  userId?: string;
  userRole?: UserRole;
  ip?: string;
  userAgent?: string;
  startTime: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}