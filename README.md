# Smart Expense Tracker

Production-grade fintech SaaS app — React + Vite + TypeScript frontend, AWS Serverless backend.

## Architecture
```
Browser → API Gateway (JWT auth) → Lambda (TypeScript)
                                        ↓
                                   DynamoDB  (expenses)
                                   S3        (receipts)
Cognito → JWT tokens
```

## Quick Start (DEV mode — zero AWS needed)
```bash
cd frontend && cp .env.example .env.local && npm install && npm run dev
```
Visit http://localhost:5174, enter any username, click Continue.

## AWS Deployment
```bash
# 1. Build backend
cd backend && npm install && npm run build

# 2. Deploy infrastructure
cd infra && sam build && sam deploy --guided

# 3. Copy outputs to frontend/.env.production
# 4. Build and upload frontend
cd frontend && npm run build && aws s3 sync dist/ s3://YOUR-BUCKET
```

## File Structure
```
frontend/src/
  pages/     Auth, Dashboard, Expenses, AddExpense
  components/ Sidebar, Topbar, KPICard, SpendingChart, CategoryPie, ExpenseRow
  lib/       auth.ts, api.ts
  hooks/     useExpenses.ts
  types/     index.ts

backend/src/
  handlers/  expenses.ts, summary.ts, receipts.ts
  lib/       dynamo.ts, response.ts

infra/
  template.yaml   (SAM / CloudFormation)
```

## API Routes
```
POST   /api/expenses                      Create
GET    /api/expenses?month=YYYY-MM        List
PUT    /api/expenses/{id}                 Update
DELETE /api/expenses/{id}?date=YYYY-MM-DD Delete
GET    /api/summary/monthly?month=YYYY-MM Summary
POST   /api/receipts/presign              S3 URL
```

## DynamoDB Schema
Single-table: PK=USER#sub  SK=EXPENSE#YYYY-MM#uuid
