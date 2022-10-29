import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const HASH_ROUNDS = 12;
const usersSeedCount = 1000;

const main = async () => {
  const password = await bcrypt.hash('1234qwerA_', HASH_ROUNDS);
  const users = [{ email: 'admin@admin.com', password }];
  for (let i = 0; i < usersSeedCount; i++) {
    users.push({ email: `seed${i}@user.com`, password });
  }
  await prisma.user.createMany({ data: users });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
