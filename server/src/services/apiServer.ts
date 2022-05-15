import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { DetaDatabaseService } from "$/services/DetaDb";
import {
  GetChannelMetrics,
  GetCurrentMetric,
  GetTimestampMetric,
} from "$/services/endpoints/weeks";

export class ApiServer {
  #dbService: DetaDatabaseService;
  app: FastifyInstance;

  constructor(dbService: DetaDatabaseService) {
    this.#dbService = dbService;
    this.app = this.#prepareServer();
  }

  #prepareServer() {
    const api = Fastify({ logger: false });

    api.register(fastifyCors, {
      origin: "*",
    });

    api.get("/test", GetChannelMetrics());

    api.get(
      "/channel/:channel/week/:timestamp",
      GetTimestampMetric(this.#dbService)
    );
    api.get(
      "/channel/:channel/week-current",
      GetCurrentMetric(this.#dbService)
    );

    api.get("/:channel/week/:timestamp", GetTimestampMetric(this.#dbService));
    api.get("/:channel/week-current", GetCurrentMetric(this.#dbService))
    return api;
  }

  public listen(port: string | number) {
    this.app.listen(port, (err, address) => {
      if (err) this.app.log.error(err);
      console.log(`api running at ${address}`);
    });
    return;
  }
}
