console.clear();
require('module-alias')('.');

import { CronJob } from 'cron';
import dayjs from 'dayjs';

import { env } from '$/lib/env';
import { database } from '$/lib/db';
import { Api } from '$/lib/twitch';
import { useApi } from '$/lib/api'

const api = useApi();
['cdubya719'].forEach(channel => {
  database.upsert(channel)
})

const main = async () => {
  const api = await Api.createApiClient(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET)

  new CronJob('* * * * *', async () => {
    console.log(`[${new Date()}]job ran`)
    database.list.forEach(async (channel) => {
      const data = (await api.getStreambyLogin(channel)).data;
      // if (data.length > 0) {
      console.log(await database.upsert(channel).put({
        created: dayjs().unix(),
        viewers: data[0]?.viewer_count | 0,
      }))
      // }
    })
  }, null, true);
}

main();


// for (let i = 1; i < 29; i++) {
//   // console.log(dayjs(`2022-02-${i}`))
//   console.log(await database.upsert('cdubya719').put({
//     created: dayjs(`2022-02-${i}`).unix(),
//     viewers: 17,
//   }))
// }