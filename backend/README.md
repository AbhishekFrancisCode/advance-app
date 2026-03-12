# Event-Driven Microservices Backend

![NestJS](https://img.shields.io/badge/NestJS-Microservices-red)
![Kafka](https://img.shields.io/badge/Kafka-Event--Driven-black)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

A **production-style microservices backend** demonstrating scalable backend architecture using:

* **NestJS microservices**
* **Go API Gateway**
* **Kafka event streaming**
* **PostgreSQL**
* **Prisma ORM**
* **Docker containerization**
* **JWT authentication**

This project demonstrates **event-driven architecture used in real distributed systems**.

---

# System Architecture

```mermaid
graph TD

Client[Client / Postman]

Gateway[API Gateway - Go]

Auth[Auth Service - NestJS]

User[User Service - NestJS]

Notification[Notification Service - NestJS]

Kafka[(Kafka Broker)]

AuthDB[(Auth DB)]
UserDB[(User DB)]
NotifDB[(Notification DB)]

Client --> Gateway
Gateway --> Auth
Gateway --> User

Auth --> AuthDB
User --> UserDB
Notification --> NotifDB

Auth --> Kafka
Kafka --> Notification
```

Each microservice owns its **own database**, which is a best practice for microservices.

---

# Tech Stack

## Backend

* NestJS
* Go
* Node.js

## Communication

* gRPC

## Messaging

* Apache Kafka

## Database

* PostgreSQL

## ORM

* Prisma

## Authentication

* JWT
* Refresh Tokens
* Role Guards

## DevOps

* Docker
* Docker Compose
* pnpm monorepo

---

# Project Structure

```
backend
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── pnpm-workspace.yaml
│
├── libs
│   └── auth
│       ├── guards
│       ├── decorators
│       ├── interfaces
│       └── auth.module.ts
│
├── services
│   ├── auth-service
│   │   ├── src
│   │   ├── prisma
│   │   └── Dockerfile
│   │
│   ├── user-service
│   │   ├── src
│   │   ├── prisma
│   │   └── Dockerfile
│   │
│   └── notification-service
│       ├── src
│       ├── prisma
│       └── Dockerfile
│
├── proto
│
└── api-gateway
    └── main.go
```

Each service is **independent and owns its own database**.

---

# Features

## Authentication

* User Registration
* Password hashing using **bcrypt**
* JWT Access Tokens
* Refresh Token Flow
* Refresh Token Storage

---

## Authorization

* JWT Guards
* Role Guards
* Shared Auth Library

---

## User Service

* Create user profile
* Get user by email
* Get user by ID
* Update user profile

---

## Event-Driven Notifications

Kafka events used:

```
user_registered
discount_notification
```

The **Notification Service** consumes these events.

---

# User Registration Flow

```mermaid
sequenceDiagram

participant Client
participant Gateway
participant AuthService
participant UserService
participant Kafka
participant NotificationService

Client->>Gateway: Register Request
Gateway->>AuthService: gRPC Register

AuthService->>AuthService: Create User
AuthService->>UserService: Create User Profile

AuthService->>Kafka: Publish user_registered event

Kafka->>NotificationService: Consume Event

NotificationService->>NotificationService: Send Welcome Email
NotificationService->>NotificationService: Save Notification Log
```

---

# Kafka Event Processing

```mermaid
graph TD

Kafka[(Kafka Topic)]

Consumer[Kafka Consumer]

Router[EventRouterService]

Handler1[UserRegisteredHandler]
Handler2[DiscountNotificationHandler]

Service[NotificationService]

Kafka --> Consumer
Consumer --> Router

Router --> Handler1
Router --> Handler2

Handler1 --> Service
Handler2 --> Service
```

Handlers are registered using decorators.

Example:

```ts
@KafkaEvent(KafkaEvents.USER_REGISTERED)
export class UserRegisteredHandler {}
```

---

# Service Communication

```mermaid
graph LR

Gateway[API Gateway]

Auth[Auth Service]
User[User Service]
Notification[Notification Service]

Gateway -->|gRPC| Auth
Gateway -->|gRPC| User

Auth -->|Kafka Event| Notification
```

---

# Databases

Three PostgreSQL databases are used.

| Service              | Database       |
| -------------------- | -------------- |
| Auth Service         | authdb         |
| User Service         | userdb         |
| Notification Service | notificationdb |

Each service manages its schema using **Prisma ORM**.

---

# Environment Variables

Create `.env` inside:

```
services/notification-service/.env
```

Example:

```
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/notificationdb
```

⚠ Gmail requires **App Password**, not your normal password.

Steps:

```
Google Account
Security
2-Step Verification
App Passwords
```

---

# Running the Project

## 1 Install Prerequisites

Install:

* Docker
* Docker Compose
* Node.js
* pnpm

Install pnpm:

```
npm install -g pnpm
```

---

# 2 Clone Repository

```
git clone <repository-url>

cd backend
```

---

# 3 Start Services

```
docker compose -f docker-compose.dev.yml up --build
```

This will start:

* PostgreSQL
* Kafka
* Auth Service
* User Service
* Notification Service

---

# 4 Run Prisma Migrations

Inside each service container:

```
pnpm exec prisma migrate deploy
```

---

# 5 Test Registration API

Example request:

```
POST /register
```

Payload:

```
{
  "email": "test@test.com",
  "password": "123456",
  "name": "Abhishek",
  "phone": "9876543211"
}
```

---

# Expected System Flow

1. User registers
2. Auth Service creates account
3. User Service creates profile
4. Kafka publishes `user_registered` event
5. Notification Service consumes event
6. Welcome email sent
7. Notification saved in database

---

# Docker Commands

Start services

```
docker compose -f docker-compose.dev.yml up
```

Rebuild containers

```
docker compose -f docker-compose.dev.yml up --build
```

Stop containers

```
docker compose -f docker-compose.dev.yml down
```

View logs

```
docker compose logs -f
```

---

# Future Improvements

Planned enhancements:

* Kafka Dead Letter Queue (DLQ)
* Retry policies
* SMS notification service
* Email templates
* Distributed tracing
* Metrics and monitoring
* Rate limiting

---

# Learning Outcomes

This project demonstrates:

* Microservices architecture
* Event-driven systems
* gRPC service communication
* Kafka messaging
* Containerized development
* Scalable backend patterns

---

# Author

A_Francis

Full Stack Developer

Tech Stack:

```
React
Golang
Next.js
NestJS
Node.js
Flutter
AWS
Microservices
DevOps
```

---
