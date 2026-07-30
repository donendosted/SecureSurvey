import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('Backend API', () => {
  let tokens: { accessToken: string; refreshToken: string };

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@test.com', password: 'password123', name: 'Test User' });
    tokens = res.body.data.tokens;
  });

  describe('Health Check', () => {
    it('GET /api/health returns ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
    });
  });

  describe('Auth', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'password123' });
      expect(res.status).toBe(201);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('should login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });
  });

  describe('Surveys', () => {
    let surveyId: string;

    it('should create a survey', async () => {
      const res = await request(app)
        .post('/api/v1/surveys')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({
          title: 'Test Survey',
          questions: [{ type: 'text_short', title: 'Test Question', required: true }],
        });
      expect(res.status).toBe(201);
      surveyId = res.body.data.id;
    });

    it('should list surveys', async () => {
      const res = await request(app).get('/api/v1/surveys');
      expect(res.status).toBe(200);
      expect(res.body.data.items).toBeDefined();
    });

    it('should get survey by id', async () => {
      const res = await request(app).get(`/api/v1/surveys/${surveyId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Test Survey');
    });

    it('should publish a survey', async () => {
      const res = await request(app)
        .post(`/api/v1/surveys/${surveyId}/publish`)
        .set('Authorization', `Bearer ${tokens.accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('published');
    });
  });

  describe('Responses', () => {
    it('should submit a response', async () => {
      const surveyRes = await request(app)
        .post('/api/v1/surveys')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({
          title: 'Response Test Survey',
          questions: [{ type: 'text_short', title: 'Q1', required: true }],
        });
      const surveyId = surveyRes.body.data.id;

      await request(app)
        .post(`/api/v1/surveys/${surveyId}/publish`)
        .set('Authorization', `Bearer ${tokens.accessToken}`);

      const res = await request(app)
        .post(`/api/v1/surveys/${surveyId}/responses`)
        .send({ answers: [{ questionId: surveyRes.body.data.questions[0].id, value: 'Test answer' }] });
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('completed');
    });
  });
});
