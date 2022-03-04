import { Api } from "$/lib/twitch";
import { DatabaseService, ToPayload } from "./Interfaces/databaseService";
import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { getIsoYearWeek } from "$/lib/util";
import dayjs from "dayjs";

export class ApiServer {
  #dbService: DatabaseService;
  #app: FastifyInstance;

  constructor(dbService: DatabaseService) {
    this.#dbService = dbService;
    this.#app = this.#prepareServer();
  }

  #prepareServer() {
    const api = Fastify({ logger: false });

    api.register(fastifyCors, {
      origin: "*",
    });

    api.get("/", async (request, reply) => {
      const list = (await this.#dbService.GetChannelList()).map((channel) => ({
        channel,
        link_secure: `https://${request.hostname}/${channel}`,
        link_unsecure: `http://${request.hostname}/${channel}`,
      }));
      reply.send(list);
    });

    api.get("/:channel", async (request, reply) => {
      const channel = (
        request.params as { channel: string }
      ).channel.toLowerCase();

      const IsoWeekYear = getIsoYearWeek(dayjs());
      const lastIsoWeekYear = getIsoYearWeek(dayjs().subtract(7, "d"));
      const channelData = await this.#dbService.GetChannelMetric(channel);
      if (!channelData) {
        reply.code(404);
        reply.send();
        return;
      }

      const currStats = channelData.WeeklyMetrics[IsoWeekYear] || {
        count: 0,
        sum: 0,
      };
      const prevStats = channelData.WeeklyMetrics[lastIsoWeekYear] || {
        count: 0,
        sum: 0,
      };

      reply.send({
        current: ToPayload(currStats),
        last: ToPayload(prevStats),
      });
    });
    return api;
  }

  Listen(port: string | number) {
    this.#app.listen(port, (err, address) => {
      if (err) this.#app.log.error(err);
      console.log(`api running at ${address}`);
    });
    return;
  }
}
