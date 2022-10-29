import { config } from '@lib/config';
import { Client } from 'twitter-api-sdk';

declare global {
  var twitter: Client | undefined;
}

const { isProduction } = config;

// Prevent multiple instances of Twitter Client in development
export const client = global.twitter || new Client(config.twitter.bearerToken);

if (isProduction) global.twitter = client;
