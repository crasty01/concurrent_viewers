import { config, DotenvParseOutput } from 'dotenv';

interface Env extends DotenvParseOutput {
  DETA_PROJECT_KEY: string;
  DETA_PROJECT_ID: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  ACCESS_URL: string;
}

export const env = config().parsed as Env;