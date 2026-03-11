FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install

# Copy project
COPY . .

EXPOSE 50051

CMD sh -c "sleep 5 && cd services/auth-service && npx prisma migrate deploy && pnpm start:dev"