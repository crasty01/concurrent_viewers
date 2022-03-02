import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import dayjs from 'dayjs';
import { database } from '$/lib/db';
import { env } from '$/lib/env';
import { FetchResponse } from 'deta/dist/types/types/base/response';

interface DetaItem {
  channel: number;
  viewers: number;
  created: number;
  key: string;
}

interface Sum {
  sum: number;
  count: number;
}

const MAX_INT = 2n ** (64n - 1n) - 1n;
const api = Fastify({ logger: false });
api.register(fastifyCors, {
  origin: '*',
})


api.get('/', (request, reply) => {
  const list = database.list.map(channel => ({
    channel,
    link_secure: `https://${request.hostname}/${channel}`,
    link_unsecure: `http://${request.hostname}/${channel}`,
  }))
  reply.send(list)
})

api.get('/:channel', async (request, reply) => {
  const channel = (request.params as { channel: string }).channel.toLowerCase();
  const SUNDAY_CURRENT = dayjs().day(0).hour(0).minute(0).second(0).millisecond(0).unix()
  const SUNDAY_LAST = dayjs().day(-7).hour(0).minute(0).second(0).millisecond(0).unix()

  if (database.has(channel)) {
    const items = (await database.get(channel)?.fetch({ 'created?gt': (SUNDAY_LAST) }))?.items as unknown as Array<DetaItem>

    const data = {
      current: {
        sum: 0,
        count: 0,
        average: -1,
      },
      last: {
        sum: 0,
        count: 0,
        average: -1,
      }
    }


    for (const item of items) {
      const p = item.created >= SUNDAY_CURRENT ? 'current' : 'last';
      data[p].count += 1;
      data[p].sum += item.viewers;
    }

    data.current.average = data.current.sum / data.current.count;
    data.last.average = data.last.sum / data.last.count;
    reply.send({
      data: { channel, ...data },
      error: null,
    })
  } else {
    reply.statusCode = 404;
    reply.send({ data: null, error: 'no such channel' })
  }
})


export const useApi = () => {
  api.listen(env.PORT, (err, address) => {
    if (err) api.log.error(err)
    console.log(`api running at ${address}`)
  });

  return api
} 