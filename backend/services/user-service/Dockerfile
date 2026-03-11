FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

EXPOSE 50052

CMD sh -c "sleep 5 && cd services/user-service && npx prisma migrate deploy && pnpm start:dev"