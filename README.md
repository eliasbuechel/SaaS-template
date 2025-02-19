# SaaS-template
This project is ment as base to develop saas projects for shopify.
## Code structure
```
saas-template/
│── backend/
│   ├── auth-service/ (Handles login, Shopify OAuth)
│   ├── billing-service/ (Stripe integration)
│   ├── user-management/ (User & tenant management)
│   ├── shopify-app-engine/ (Interacts with Shopify API)
│   ├── analytics-service/ (Data aggregation)
│   ├── marketing-automation/ (Campaigns, emails, SMS)
│── frontend/
│   ├── admin-dashboard/ (Next.js + React for admin)
│   ├── customer-dashboard/ (Next.js + React for merchants)
│── database/
│   ├── migrations/
│   ├── schemas/
│── infra/
│   ├── docker/ (Docker configurations)
│   ├── kubernetes/ (K8s manifests)
│── tests/
│── docs/
│── .env
│── package.json
│── README.md
```