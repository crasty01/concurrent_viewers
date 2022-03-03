
console.clear();
require('module-alias')('.');

import { env } from '$/lib/env';
import { CronJob } from 'cron';
import { Api } from './lib/twitch';
import { ApiServer } from './services/apiServer';
import { InMemoryDb } from "./services/inMemoryDb";
const cannels=['cdubya719']

const db = new InMemoryDb(cannels.map(x=>x.toLowerCase()))

new ApiServer(db).Listen(env.PORT)

async function main(){
    const api = await Api.createApiClient(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET) 

    console.log(db.GetChannelList())

    new CronJob('* * * * *', async () => {
        console.log(`[${new Date()}]job ran`)
        const ts = new Date()
        
        //TODO: giveth twitch api a list of channels
        for (const channel of await db.GetChannelList()){
          const data = (await api.getStreambyLogin(channel)).data as Array<{user_login:string,viewer_count:number}>;
          for(const x of data){
            db.AddMetric(x.user_login,ts,x.viewer_count)
          }
        }
      }, null, true);
}

main()