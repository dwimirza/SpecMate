import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'pass',
  database: process.env.DB_NAME ?? 'spec_mate',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
});

const prisma = new PrismaClient({
  adapter,
});

export { prisma };
