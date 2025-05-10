import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Admin (e2e)', () => {
  let app: INestApplication;

  let adminToken: string;
  let testAdminEmail = 'admin@email.com';
  let testAdminPassword = 'admin123';
  let newClassId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/classes/${newClassId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    await app.close();
  });

  it('should login as admin and store token', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testAdminEmail, password: testAdminPassword });

    expect(login.status).toBe(201);
    expect(login.body.access_token).toBeDefined();
    adminToken = login.body.access_token;
  });

  it('should allow admin to create a class', async () => {
    const res = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Class',
        sport: 'Basketball',
        description: 'Test class description',
        schedule: ['Monday 10:00', 'Wednesday 10:00'],
        duration: 60,
      });

    newClassId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Class');
  });
});
