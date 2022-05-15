import { getIsoYearWeek, weekBucket } from "$/lib/util";
import dayjs from "dayjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { DetaDatabaseService } from "$/services/DetaDb";

export interface WeekStat extends weekBucket {
  average: number;
}

function toPayload(wb: weekBucket): WeekStat {
  return {
    sum: wb.sum,
    count: wb.count,
    target: wb.target,
    average: wb.sum / wb.count || 0,
  };
}

// GET /channel/:channel/week/:timestamp
export function GetTimestampMetric(db: DetaDatabaseService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { channel: string; timestamp: string };

    const channel = params.channel.toLocaleLowerCase();
    const ts_int = Date.parse(params.timestamp);
    if (isNaN(ts_int)) {
      reply.code(401);
      return "";
    }
    const channelData = await db.getChannelWeekMetric(
      channel,
      getIsoYearWeek(dayjs(ts_int))
    );

    if (!channelData) {
      reply.code(404);
      return "";
    }
    return toPayload(channelData);
  };
}

// GET /channel/:channel/week-current
export function GetCurrentMetric(db: DetaDatabaseService){
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const params = request.params as { channel: string };

        const channel = params.channel.toLocaleLowerCase();
  
        const channelData = await db.getChannelWeekMetric(
          channel,
          getIsoYearWeek(dayjs())
        );
  
        if (!channelData) {
          reply.code(404);
          return "";
        }
        return toPayload(channelData);
    }
}


export function GetChannelMetrics(){
    return async (request: FastifyRequest, reply: FastifyReply) => {
       return request.query
    }
}