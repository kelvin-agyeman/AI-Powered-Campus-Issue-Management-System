# AI-Powered Campus Issue Management System

## Project Title

[![Node.js Version](https://img.shields.io/badge/node-22.x-green.svg)](https://nodejs.org)
[![NPM Version](https://img.shields.io/badge/npm-10.x-red.svg)](https://nodejs.org)
[![Express Framework](https://img.shields.io/badge/express-5.x-blue.svg)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

A production-ready, AI-powered campus issue reporting and management platform that enables students to report maintenance and facility issues while assisting administrators through intelligent issue classification, department recommendation, duplicate detection, priority prediction, and resolution support using Large Language Models (LLMs).

---

## Table of Contents

- Features
- Technology Stack
- System Architecture
- Project Structure
- Prerequisites
- Installation
- Environment Variables
- Running the Project
- API Documentation
- AI Features
- User Roles
- Project Workflow
- Database Collections
- Scripts
- Deployment
- Future Improvements
- Author
- License

---

# Features

## Authentication

- Student registration
- Secure login using Institution ID
- JWT authentication
- Email verification
- Forgot password
- Password reset
- Role-based authorization
- Account activation/deactivation

---

## Student Features

- Report campus issues
- Upload multiple images
- View submitted issues
- Track issue progress
- Update pending issues
- Delete pending issues
- View AI recommendations
- Receive notifications
- Manage profile
- Request Institution ID change

---

## AI Features

- Automatic issue classification
- Department recommendation
- Priority prediction
- Confidence scoring
- AI-generated title
- AI-generated summary
- AI reasoning
- Duplicate issue detection
- Resolution support generation

---

## Administrator Features

- Review submitted issues
- Approve AI recommendations
- Modify AI recommendations
- Reject issues
- Assign staff
- Monitor issue progress
- Broadcast announcements
- View analytics dashboard

---

## Staff Features

- View assigned issues
- Update issue progress
- Upload resolution evidence
- Resolve issues
- Receive notifications

---

## Super Administrator Features

- Register administrators
- Register staff
- Manage users
- Approve profile update requests
- Broadcast announcements
- View analytics

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- TanStack Query
- TanStack Router
- Axios
- Recharts
- Sonner

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- JSON Web Tokens (JWT)
- Nodemailer
- Cloudinary

## Artificial Intelligence

- LangChain.js
- Large Language Models (LLMs)

## Documentation

- Swagger / OpenAPI

---

# System Architecture

The application follows a layered architecture consisting of:

- Presentation Layer
- REST API Layer
- Business Logic Layer
- Artificial Intelligence Layer
- Data Access Layer
- Database Layer

This separation improves scalability, maintainability, and testing while keeping AI functionality independent of the core business logic.

---

# Project Structure

```text
server/
│
├── src/
│   ├── config/
│   ├── controllers/
|   |── docs/
|       |── swagger.yaml
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   ├── server.ts
│
├── package.json
├── tsconfig.json
|__ .env
```

---

# Prerequisites

Install the following:

- Node.js (v22 or later)
- Mongoose
- npm
- Git

---

# Installation

Clone the repository

```bash
git clone https://github.com/kelvin-agyeman/AI-Powered-Campus-Issue-Management-System.git
```

Navigate into the server directory

```bash
cd server
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file inside the server directory.

Example:

```env
NODE_ENV=

PORT=

MONGO_URL=

JWT_SECRET=

CLIENT_URL=

GMAIL_USER=
GMAIL_APP_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GROQ_API_KEY=
```

---

# Running the Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

# API Documentation

Swagger documentation is available after starting the server.

```
/api-docs
```

---

# AI Features

Whenever a student submits an issue, the system automatically performs:

- Issue categorization
- Department recommendation
- Priority prediction
- Confidence scoring
- Issue summarization
- Duplicate detection
- Resolution support generation

Administrators can approve or modify the AI recommendations before assigning issues to staff.

---

# User Roles

## Student

- Register
- Login
- Submit issues
- View own issues
- Update issues
- Delete issues
- Receive notifications

---

## Staff

- Login
- View assigned issues
- Update progress
- Resolve issues
- Upload resolution images

---

## Administrator

- Review issues
- Approve issues
- Modify AI recommendations
- Reject issues
- Assign staff
- Broadcast announcements
- View analytics

---

## Super Administrator

- Register administrators
- Register staff
- Manage users
- Approve profile updates
- Broadcast announcements
- View analytics

---

# Project Workflow

1. Student submits an issue.
2. AI analyzes the issue.
3. Duplicate detection is performed.
4. Administrator reviews AI recommendations.
5. Administrator approves, modifies, or rejects the issue.
6. Approved issues are assigned to staff.
7. Staff updates progress.
8. Staff resolves the issue.
9. Notifications are sent throughout the workflow.
10. Analytics are updated automatically.

---

# Database Collections

- Users
- Issues
- Notifications
- Edit Details Requests

---

# Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Compiles the project.

```bash
npm start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

---

# Deployment

The backend can be deployed on platforms such as:

- Render
- Railway
- Fly.io
- DigitalOcean
- AWS

---

# Future Improvements

- Real-time notifications
- Mobile application
- Push notifications
- AI chatbot support
- Predictive maintenance analytics
- Multi-campus support
- GIS-based issue visualization

---

# Author

**Kelvin Oppong Agyeman**

Computer Science Student

Kwame Nkrumah University of Science and Technology (KNUST)

---

# License

This project is licensed under the MIT License.
