console.clear();
require('module-alias')('.');

import { env } from '$/lib/env';
import { CronJob } from 'cron';
import { Api } from '$/lib/twitch';
import { ApiServer } from '$/services/apiServer';
import { DetaDatabaseService } from '$/services/DetaDb';
import { Scaper } from '$/services/scraper';

const channels = ['cdubya719', 'crasty', 'Asmongold', 'sodapoppin']

// const db = new DetaDatabaseService(env.DETA_PROJECT_KEY, channels.map(x => x.toLowerCase()))

// new ApiServer(db).listen(env.PORT)

async function main() {
  // const api = await Api.createApiClient(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET)

  // const scraper = new Scaper(db,api)
  // console.log(`watching channels:\n${db.getChannelList().map(e => `-- ${e}`).join('\n')}\n`)

  // new CronJob('* * * * *', async () => {
  //   console.log(`[${(new Date()).toISOString()}] - job ran`)
  //   await scraper.Scrape()
  // }, null, true);

  const api = Api.createApiClient(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET)


}

main()

