import { Api } from "$/lib/twitch";
import { FastifyRequest, FastifyReply } from "fastify";
import { Scaper } from "../scraper";


type DetaEvent = {
    event: {
        id: string
        trigger: "schedule"
    }
}

//POST /__space/v0/actions
export function DetaActionHandler(scaper: Scaper) {
    return async (request: FastifyRequest<{ Body: DetaEvent }>, reply: FastifyReply) => {
        if (request.body.event.id != "scrape"){
            reply.code(400);
            return "";
        }
        scaper.Scrape()
        return "";
    }
}