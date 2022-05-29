import { AuthService, SessionService } from "$/services/Auth";
import { FastifyReply, FastifyRequest } from "fastify";
import { DetaDatabaseService } from "$/services/DetaDb";

import { toPayload } from "./weeks";
const bPrefix = "Bearer ";

function extractAuthHeader(authHeader: string | undefined) {
  if (authHeader == null) {
    return null;
  }

  if (!authHeader.startsWith(bPrefix)) {
    return null;
  }

  return authHeader.substring(bPrefix.length);
}

declare module "fastify" {
  interface FastifyRequest {
    uid: string;
    authToken: string;
  }
}

export function AuthMiddleware(sesssvc: SessionService) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (error?: Error) => void
  ) => {
    const token = extractAuthHeader(request.headers.authorization);

    if (token == null) {
      done(new Error("unset token"));
      return;
    }

    const uid = await sesssvc.ValidateToken(token);

    if (uid == undefined) {
      done(new Error("invalid token"));
      return;
    }
    request.authToken = token;
    request.uid = uid;
  };
}

//GET /channel-admin/channels-available
export function GetManagedChannels(authsvc: AuthService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { uid } = request;
    const authChan = await authsvc.GetAuthorizedChannels(uid);
    if (authChan == null) {
      reply.code(403);
      return new Error(`You don't have any authorized channels`);
    }
    return authChan;
  };
}

// GET /channel-admin/channel/:channel
export function GetChannelMetric(
  db: DetaDatabaseService,
  authsvc: AuthService
) {
  return async (
    request: FastifyRequest<{
      Params: { channel: string };
      Querystring: {
        limit: string;
        lastID: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    const { channel } = request.params;
    const { uid } = request;
    const channels = new Set((await authsvc.GetAuthorizedChannels(uid)) || []);

    if (!channels.has(channel)) {
      reply.code(403);
      return new Error(`You don't have access to channel "${channel}"`);
    }
    const { lastID, limit } = request.query;
    const limitInt = parseInt(limit);

    const data = await db.GetChannelMetrics(
      channel,
      lastID ? lastID : undefined,
      limitInt ? limitInt : undefined
    );

    if (data == null) {
      reply.code(404);
      return {
        message: "no messages found",
      };
    }

    return {
      lastID: data.lastMetricID,
      metrics: data.metrics.map((x) => ({ key: x.key, ...toPayload(x) })),
    };
  };
}
