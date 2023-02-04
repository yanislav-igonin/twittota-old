import { config } from '@config';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const { isProduction } = config;

// Prevent multiple instances of Prisma Client in development
const logLevel = isProduction ? 'error' : 'info';
export const db =
  global.prisma ||
  new PrismaClient({
    log: [logLevel],
  });

if (isProduction) {
  global.prisma = db;
}
