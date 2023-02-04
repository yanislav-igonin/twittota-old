import bcrypt from 'bcrypt';

const HASH_ROUNDS = 12;

export const compare = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hash = (password: string) => {
  return bcrypt.hash(password, HASH_ROUNDS);
};
