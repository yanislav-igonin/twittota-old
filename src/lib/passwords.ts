import bcrypt from 'bcrypt';

const HASH_ROUNDS = 12;

export const compare = (password: string, hash: string) => bcrypt.compare(password, hash);

export const hash = (password: string) => bcrypt.hash(password, HASH_ROUNDS);
