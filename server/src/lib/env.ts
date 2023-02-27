import { config, DotenvParseOutput } from 'dotenv';

interface Env extends DotenvParseOutput {
  TWITCH_SCRAPE_CHANNELS: string;
  DETA_PROJECT_KEY: string;
  CUSTOM_DETA_PROJECT_KEY: string;
  DETA_PROJECT_ID: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;
  ACCESS_URL: string;
  PORT: string;
}
config()
export const env = process.env as Env;