import { TRPCError } from '@trpc/server';

enum Codes {
  BadRequest = 'BAD_REQUEST',
  Unauthorized = 'UNAUTHORIZED',
}

enum Messages {
  InvalidEmailOrPassword = 'Invalid email or password',
  Unauthorized = 'Unauthorized',
}

export class InvalidEmailOrPasswordError extends TRPCError {
  constructor() {
    super({
      code: Codes.BadRequest,
      message: Messages.InvalidEmailOrPassword,
    });
  }
}

export class UnauthorizedError extends TRPCError {
  constructor() {
    super({
      code: Codes.Unauthorized,
      message: Messages.Unauthorized,
    });
  }
}
