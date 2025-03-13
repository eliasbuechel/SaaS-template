# node-express-template
## Code structure
```
/src
 ├── controllers/     # Route handlers
 ├── middleware/      # Express middleware (auth, logging, error handling)
 ├── models/         # Database models (Prisma, Mongoose, or Sequelize)
 ├── routes/         # Route definitions
 ├── services/       # Business logic (e.g., sending emails, external APIs)
 ├── utils/          # Utility functions
 ├── config/         # Configurations (env, database, security)
 ├── index.ts        # Main server entry point
 ├── app.ts          # Express app initialization
/tests               # Jest or Vitest tests

```

## Setup

Create a .env file in the root of the project and set the environment variables accordingly
```dotenv
LOG_LEVEL=

PORT=
ALLOWED_CORS_ORIGIN=

REDIS_URL=

SESSION_SECRET=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ENCRYPTION_KEY=

DATABASE_URL=
```


| Variable              | Description                                                                                               | Example Value                                                                              |
|-----------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `LOG_LEVEL`           | Logging level (`error`, `warn`, `info`, `debug`)                                                          | `info`                                                                                     |
| `PORT`                | The port on which the server runs                                                                         | `4000`                                                                                     |
| `ALLOWED_CORS_ORIGIN` | Allowed origins for CORS requests                                                                         | `http://localhost:3000`                                                                    |
| `REDIS_URL`           | Redis connection URL (only needed in production)                                                          | `redis://redis:6379`                                                                       |
| `SESSION_SECRET`      | Secret key for session encryption (generate it using `openssl rand -base64 64`)                           | `08R+bUSpf4o4AqogNiIn4SW3c7dudMJvKU5tUz8P4vL6ypD5DjQZz5n4ws+7SLdg9w6FZ29oqLA29u0QFrlqSA==` |
| `JWT_ACCESS_SECRET`   | Secret key for signing JWT access tokens (generate it using `openssl rand -base64 32`)                    | `uy4ZSVOp/7U6xh5OMDgxVmlVMVj7AGgneUjrss2DpiE=`                                             |
| `JWT_REFRESH_SECRET`  | Secret key for signing JWT refresh tokens (generate it using `openssl rand -base64 64`)                   | `eYnEdqBnn5KdLSu9wluKn6Yg+YDWjufaouy6ysOyVF28gFhx3ZnaN7e/uMH7PRlYvEj91iBbW/yEMIRU5Va1SA==` |
| `ENCRYPTION_KEY`      | Secret key for encrypting data (generate it using `openssl rand -base64 24 \| tr -d '/+=' \| cut -c1-32`) | `mEq3MVBt1m6Er3ierJ6DSH5PUEZ9rPfP`                                                         |
| `DATABASE_URL`        | Database connection string                                                                                | `postgres://user:password@localhost:5432/db_name`                                          |



The environment file gets loaded automatically. _(local development using dotenv, docker using env_file in docker compose)_

---
### Development (local)

Prerequisites: _node@v23.8.0_, _yarn@4.7.0_, _redis database running_

install packages on local machine
```shell
yarn install
```

install packages on local machine
```shell
yarn dev:local
```

---
### Development (Docker)
Prerequisites: _docker_, _docker compose_

start the application using docker
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build 
```
- Starts the server in development mode (yarn dev)
- Runs a Redis container
- Loads environment variables from .env
---
### Production (Docker)

Prerequisites: _docker_, _docker compose_

start the application using docker
```shell
docker compose up --build 
```

---