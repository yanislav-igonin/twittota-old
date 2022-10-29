export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ? parseInt(process.env.PORT, 10): 3000,
  twitter: {
    bearerToken: process.env.TWITTER_BEARER_TOKEN ?? '',
  },
};
