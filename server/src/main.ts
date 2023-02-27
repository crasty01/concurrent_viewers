console.clear();
require("module-alias")(".");
require('log-timestamp');
import { env } from "$/lib/env";
import { Api } from "$/lib/twitch";
import { ApiServer } from "$/services/apiServer";
import { DetaDatabaseService } from "$/services/DetaDb";
import { AuthService, SessionService } from "$/services/Auth";
import { Scaper } from "./services/scraper";

let channels = ["KrazeyHazey",];
if (env.TWITCH_SCRAPE_CHANNELS) {
  channels = env.TWITCH_SCRAPE_CHANNELS.split(",")
}

let access_url = process.env.DETA_SPACE_APP_HOSTNAME as string
if (env.ACCESS_URL) {
  access_url = env.ACCESS_URL
}

let collectionName = process.env.DETA_PROJECT_KEY
if (env.CUSTOM_DETA_PROJECT_KEY) {
  collectionName = env.CUSTOM_DETA_PROJECT_KEY
}

const twitchApi = new Api(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
const sessSvc = new SessionService(
  collectionName,
  `https://${access_url}/login/twitch`,
  env.TWITCH_CLIENT_ID,
  env.TWITCH_CLIENT_SECRET
);
const authSvc = new AuthService(collectionName);
const db = new DetaDatabaseService(
  collectionName,
  channels.map((x) => x.toLowerCase())
);

const scraper = new Scaper(db, twitchApi);

new ApiServer(db, authSvc, sessSvc, scraper).listen(parseInt(env.PORT));
