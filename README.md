# Sports Management System

A NestJS backend API for managing sports classes. Includes user registration, authentication, role-based access control, and class management.

## Tech Stack

- **NestJS** (TypeScript, Express)
- **PostgreSQL** with **TypeORM**
- **JWT Authentication**
- **Swagger API Documentation**
- **Role-based Authorization**
- **Integration & Unit Testing**
- **pgAdmin4** for DB management

---

### Reason for these technologies
- **PostgreSQL**: Strong relational structure for users <-> classes <-> applicants.
- **TypeORM**: Full decorator and DI support for NestJS. Clean integration.
- **NestJS**: Modular, testable, and scalable structure ideal for APIs.
- **Swagger**: Auto-generated docs improve API understanding and onboarding.
- **bcrypt + JWT**: Secure authentication with encrypted passwords and token-based access.
> I considered Prisma and MongoDB, but for this relational setup, TypeORM with Postgres was the better fit.

---

### Entity Relationship (ER) Diagram
Below is a simplified view of the relational structure:

![ER Diagram](https://github.com/user-attachments/assets/3604a81b-0ec0-4807-9970-e24d8550c0d5)
> Diagram created using [draw.io](https://draw.io) and stored in `/docs`.

This diagram illustrates the core data structure:
- user: Represents registered users. Each user can apply for multiple sport classes.
- sport_class: Represents a scheduled class for a specific sport. Each class contains details like title, schedule, and creator.
- user_applied_classes_sport_class: This is a join table automatically created by TypeORM to manage the many-to-many relationship between users and sport classes. It connects:
  - userId -> user.id
  - sportClassId -> sport_class.id

In short:
- A user can apply to many sport classes.
- A sport class can have many users.
- Admins manage sport classes, users apply to them.

### Installed Packages
Authentication & Authorization
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/passport-jwt @types/bcrypt
```
- **@nestjs/jwt** - Lets you sign and verify JWT tokens inside NestJS services
- **@nestjs/passport, passport, passport-jwt** - Passport strategies for JWT
- **bcrypt** - Used to hash passwords before saving and to compare at login
- **@types/\*** – TypeScript support

Database & Environment
```bash
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config
```
- **@nestjs/typeorm** - Integrates TypeORM into NestJS
- **pg** - PostgreSQL driver lets your app talk to Postgres
- **@nestjs/config** - Used for environment support

Validation & Transformation
```bash
npm install class-validator class-transformer
```
- **class-validator** - Adds decorators like @IsEmail(), @MinLength(). Validating input
- **class-transformer** - Transforms raw JSON into class instances automatically. Enabling decorators

API Documentation
```bash
npm install @nestjs/swagger swagger-ui-express
```
- **@nestjs/swagger**		Builder for API docs
- **swagger-ui-express**	Viewer for API docs

# Getting Started

### Prerequisites

- Node.js (v22+)
- PostgreSQL installed & running
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/mgaliman/sports-management-system.git
cd sports-management-system
npm install
```

### 2. Configure Environment
Create a .env file at the root:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sports_management_db

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

### 3. Start the Server
```bash
npm run start:dev
```

---

### API Documentation
Visit: http://localhost:3000/api

Generated with Swagger.

---

### Authentication & Roles
- Users register and log in via /auth
- JWT is used for protected routes
- Roles: user (default) and admin
- Admins can manage sport classes and view applicants

---

### Running Tests
Unit & Integration Tests
```bash
# unit tests
npm run test
 
# e2e tests
npm run test:e2e
```
For specific set of tests
```bash
# run specific unit test file
npm run test -- src/folder/file.service.spec.ts
 
# run specific e2e test file
npm run test:e2e -- test/file.e2e-spec.ts
```

---

### Project Structure
```bash
src/
  auth/              -> Login, register, roles, guards, decorators, strategies
  user/              -> User entity, service, controller
  sport-class/       -> Class entity, service, controller
  app.module.ts      -> Root module combining all features
  main.ts            -> Application entry point
```

---


### Features
- User registration & login
- Role-based access control (admin/user)
- CRUD operations for sport classes (admin)
- Apply for classes (user)
- View class applicants (admin)
- Swagger API documentation
- Full test coverage (unit & integration)

---

### Author
Marko Galiman
