console.clear();
require("module-alias")(".");

import { env } from "$/lib/env";
import { CronJob } from "cron";
import { Api } from "$/lib/twitch";
import { ApiServer } from "$/services/apiServer";
import { DetaDatabaseService } from "$/services/DetaDb";
import { AuthService, SessionService } from "$/services/Auth";

const channels = ["cdubya719", "KrazeyHazey","treiniota",];

const twitchApi = new Api(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
const sessSvc = new SessionService(
  env.DETA_PROJECT_KEY,
  env.ACCESS_URL,
  env.TWITCH_CLIENT_ID,
  env.TWITCH_CLIENT_SECRET
);
const authSvc = new AuthService(env.DETA_PROJECT_KEY);
const db = new DetaDatabaseService(
  env.DETA_PROJECT_KEY,
  channels.map((x) => x.toLowerCase())
);

new ApiServer(db, authSvc, sessSvc).listen(env.PORT);
