import Fastify, { ContextConfigDefault, FastifyInstance, FastifySchema, preHandlerHookHandler, RouteGenericInterface } from "fastify";
import fastifyCors from "@fastify/cors";
import cookie from "@fastify/cookie";

import { DetaDatabaseService } from "$/services/DetaDb";
import { AuthService, SessionService } from "$/services/Auth";
import {
  AuthMiddleware,
  GetChannelMetric,
  GetManagedChannels,
  UpdateWeekTarget,
} from "./endpoints/mgmt";
import { GetCurrentMetric, GetTimestampMetric } from "./endpoints/weeks";
import { Login, LoginTwitchCallback, logout as Logout } from "./endpoints/auth";
import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import { DetaActionHandler } from "./endpoints/deta";
import { Api } from "$/lib/twitch";
import { Scaper } from "./scraper";


declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    authmddle: FastifyAuthFunction
  }
}

export class ApiServer {
  #dbService: DetaDatabaseService;
  #sessSvc: SessionService;
  #authSvc: AuthService;
  app: FastifyInstance;
  #twtichScraper: Scaper;

  constructor(
    dbService: DetaDatabaseService,
    authSvc: AuthService,
    sessSvc: SessionService,
    twtichScraper: Scaper
  ) {
    this.#dbService = dbService;
    this.#sessSvc = sessSvc;
    this.#authSvc = authSvc;
    this.#twtichScraper = twtichScraper;
    this.app = this.#prepareServer();
  }

  #prepareServer() {
    const api = Fastify({ logger: false });

    api.register(cookie);
    api.register(fastifyCors, {
      origin: "*",
    });

    api.post("/__space/v0/actions", DetaActionHandler(this.#twtichScraper));

    api.get(
      "/channel/:channel/week/:timestamp",
      GetTimestampMetric(this.#dbService)
    );
    api.get(
      "/channel/:channel/week-current",
      GetCurrentMetric(this.#dbService)
    );

    api.get("/login", Login(this.#sessSvc));
    api.get("/login/twitch", LoginTwitchCallback(this.#sessSvc, this.#authSvc));

    api.get("/:channel/week/:timestamp", GetTimestampMetric(this.#dbService));
    api.get("/:channel/week-current", GetCurrentMetric(this.#dbService));

    api
      .decorate('authmddle', AuthMiddleware(this.#sessSvc))
      .decorateRequest("uid", undefined)
      .decorateRequest("authToken", undefined)
      .register(require('@fastify/auth'))
      .after(() => {
        api.route({
          method: "POST",
          url: "/logout",
          preHandler: api.auth([api.authmddle]),
          handler: Logout(this.#sessSvc),
        });
        api.route({
          method: "GET",
          url: "/channel-admin/channels-available",
          preHandler: api.auth([api.authmddle]),
          handler: GetManagedChannels(this.#authSvc),
        });
        api.route({
          method: "GET",
          url: "/channel-admin/channel/:channel",
          preHandler: api.auth([api.authmddle]),
          handler: GetChannelMetric(this.#dbService, this.#authSvc),
        });
        api.route({
          method: "PUT",
          url: "/channel-admin/channel/:channel/week/:weekId/target",
          preHandler: api.auth([api.authmddle]),
          handler: UpdateWeekTarget(this.#dbService, this.#authSvc),
        });
      })
    return api;
  }

  public listen(port: number) {
    this.app.listen({ port }, (err, address) => {
      if (err) this.app.log.error(err);
      console.log(`api running at ${address}`);
    });
    return;
  }
}
