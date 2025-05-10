import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  let adminToken: string;
  let newUserId: number;
  let testAdminEmail = 'admin@email.com';
  let testAdminPassword = 'admin123';
  let testEmail = 'testuser@email.com';
  let testPassword = 'testuser123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const res = await request(app.getHttpServer())
      .delete(`/user/${newUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

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

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
      });

    newUserId = response.body.id;
    console.log('New user ID:', newUserId);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(testEmail);
  });

  it('should login and return access_token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body.access_token).toBeDefined();
  });
});
