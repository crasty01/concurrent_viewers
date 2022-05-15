console.clear();
require('module-alias')('.');

import { env } from '$/lib/env';
import { CronJob } from 'cron';
import { Api } from '$/lib/twitch';
import { ApiServer } from '$/services/apiServer';
import { DetaDatabaseService } from '$/services/DetaDb';

const channels = [
  'cdubya719',
  'KrazeyHazey',
]

const twitchApi = new Api(env.TWITCH_CLIENT_ID,env.TWITCH_CLIENT_SECRET,env.ACCESS_URL)
const db = new DetaDatabaseService(env.DETA_PROJECT_KEY, channels.map(x => x.toLowerCase()))

new ApiServer(db).listen(env.PORT)
