# Authentication service (auth-service)
The authentication service is responsible for handling user authentication, authorization, and managing connections to Shopify. It issues session tokens and is also responsible for verifying and validating those tokens.
___
## Prerequisites
This service requires the following infrastructure and tools to run:
- **Node.js** (v22 or higher)
- **Yarn** – for dependency management
- **PostgreSQL** – stores tenant and shop data
- **Redis** – used for session and token storage
  > 📝 **Note**: Redis is **optional** in local development but **required** for Docker and production environments.
- **Internet access** – required for third-party authentication flows:
  - **Google OAuth**
  - **Shopify OAuth**
> ⚠️ Ensure that PostgreSQL and Redis (if enabled) are accessible from your local environment or containerized services.
___
## Getting started
### Set up environment variables
```dotenv
# Log level (options: error, warn, info, debug)
LOG_LEVEL=debug

# Public-facing hostname and port
HOST_NAME=localhost:4000
PORT=4000

# Internal port used by internal services (if applicable)
INTERNAL_PORT=4001

# Comma-separated list of allowed CORS origins (e.g., frontend apps)
ALLOWED_CORS_ORIGIN=http://localhost:3000,http://localhost:4000

# OAuth callback endpoints
GOOGLE_REDIRECT_URI=/api/auth/google/oauth2callback
SHOPIFY_REDIRECT_URI=/api/auth/shopify/oauth2callback
```
### Running Locally
Run the application using yarn:
```commandline
yarn install
yarn dev:local
```
The service will be available at: http://localhost:4000
### Running in Docker
To run the service using Docker, make sure you have **Docker** and **Docker Compose** installed on your system.
> 🛠️ **Requirement**: Docker Compose must be installed (`docker compose` or `docker-compose` command should be available).

Then, use the following command to start the service:
```commandline
docker-compose -f docker-compose.local.yml up --build
```
The service will be available at: http://localhost:4000
___
## Terminology
### Tenant
A tenant represents a unique user or organization within our system. Each tenant is created after a successful authentication via Google Sign-In. Tenants have isolated access to their own data and resources, and act as the top-level entity in our multi-tenant architecture.
### Shop
A shop refers to an individual Shopify store that a tenant connects to our platform. A single tenant can connect to and manage multiple Shopify shops. Each shop is authenticated separately using Shopify's OAuth flow and stored under the corresponding tenant.
### Example Relationship
```
Tenant (user@example.com)
├── Shop 1 (my-first-store.myshopify.com)
├── Shop 2 (my-second-store.myshopify.com)
└── ...
```
___
## Authentication
### Session Management
Access and refresh tokens are stored and sent via HTTP-only cookies. These are automatically managed by the browser and should be included in all authenticated requests.
### Login Callbacks (/auth/*/oauth2callback)
These endpoints set access_token and refresh_token in cookies after successful authentication.
### Protected Endpoints
Endpoints like /auth/status, /tenant, and /user require a valid access_token cookie. If it's missing or expired, a valid refresh_token cookie will be used to issue a new token pair.
___
## API Reference
| Endpoint                     | Methode | Parameters                                  | Response data         | Description                                                                                                        |
|------------------------------|---------|---------------------------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| /                            | GET     | -                                           | -                     | Base endpoint (can be used for health checks or service info).                                                     |
| /auth/status                 | GET     | -                                           | user, tenants, tenant | Validates the access_token. If invalid or expired, attempts to refresh it using the refresh_token.                 |
| /auth/logout                 | DELETE  | -                                           | -                     | Logs the user out by clearing session cookies and tokens.                                                          |                                                                                                              |
| /auth/google                 | GET     | redirectUrlAfterAuth, redirectUrlAfterError | -                     | Redirects the user to the Google OAuth login page.                                                                 |
| /auth/google/oauth2callback  | GET     | -                                           | -                     | Handles the Google OAuth callback. Redirects to the given URL and sets access_token and refresh_token as cookies.  |
| /auth/shopify                | GET     | redirectUrlAfterAuth, redirectUrlAfterError | -                     | Redirects the user to the Shopify OAuth login page.                                                                |
| /auth/shopify/oauth2callback | GET     | -                                           | -                     | Handles the Shopify OAuth callback. Redirects to the given URL and sets access_token and refresh_token as cookies. |
| /auth/shopify/switch         | POST    | tenantId                                    | success, tenantId     | Switches the active Shopify store. Returns new session cookies with updated tokens.                                |
| /auth/shopify/session        | GET     | session (optional)                          | session               | Returns the current Shopify session or the session specified by the query parameter.                               |
| /tenant                      | GET     | -                                           | tenant                | Retrieves information about the currently active tenant.                                                           |
| /tenant/all                  | GET     | -                                           | tenants               | Retrieves all tenants connected to the current user.                                                               |
| /user                        | GET     | -                                           | user                  | Retrieves information about the currently authenticated user.                                                      |
___
