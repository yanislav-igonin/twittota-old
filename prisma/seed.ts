import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const HASH_ROUNDS = 12;

const main = async () => {
  const password = await bcrypt.hash('1234qwerA_', HASH_ROUNDS);
  const user = { email: 'admin@admin.com', password };
  await prisma.user.create({ data: user });
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
