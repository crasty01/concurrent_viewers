console.clear();
require('module-alias')('.');

import { env } from '$/lib/env';
import { CronJob } from 'cron';
import { Api } from '$/lib/twitch';
import { ApiServer } from '$/services/apiServer';
import { DetaDatabaseService } from '$/services/DetaDb';

const channels = ['cdubya719', 'crasty', 'Asmongold', 'sodapoppin']

const db = new DetaDatabaseService(env.DETA_PROJECT_KEY, channels.map(x => x.toLowerCase()))

new ApiServer(db).listen(env.PORT)

async function main() {
  const api = await Api.createApiClient(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET)

  console.log(`watching channels:\n${db.getChannelList().map(e => `-- ${e}`).join('\n')}\n`)

  new CronJob('0/20 * * * * *', async () => {
    console.log(`[${(new Date()).toISOString()}] - job ran`)
    const ts = new Date()

    const data = (await api.getStreambyLogin(...db.getChannelList())).data as Array<{ user_login: string, viewer_count: number }>;
    for (const channel of data) {
      db.addMetric(channel.user_login, ts, channel.viewer_count)
    }
  }, null, true);
}

main()