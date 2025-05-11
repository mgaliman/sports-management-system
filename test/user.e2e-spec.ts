import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User (e2e)', () => {
  let app: INestApplication;

  let adminToken: string;
  let userToken: string;
  let newClassId: number;
  let testEmail = 'user@email.com';
  let testPassword = 'user123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@email.com', password: 'admin123' });

    expect(login.status).toBe(201);
    adminToken = login.body.access_token;
  }, 15000);

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/classes/${newClassId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    await app.close();
  });

  it('should login as test user and get token', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(login.status).toBe(201);
    userToken = login.body.access_token;
  }, 10000);

  it('admin should create a class for testing apply', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@email.com', password: 'admin123' });

    const token = login.body.access_token;

    const createResponse = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Fresh Class',
        sport: 'Basketball',
        description: 'New class for apply test',
        schedule: ['Monday 12:00'],
        duration: 60,
      });

    newClassId = createResponse.body.class.id;
    expect(createResponse.status).toBe(201);
  }, 10000);

  it('should allow user to apply to a fresh class', async () => {
    const response = await request(app.getHttpServer())
      .post(`/classes/${newClassId}/apply`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(201);
  });
});
