import { Api } from "$/lib/twitch";
import { AuthService } from "$/services/Auth";
import { FastifyReply, FastifyRequest } from "fastify";


//GET /login
export function Login(twtichApi: Api){
    return async (request: FastifyRequest, reply: FastifyReply) => {
    
        const c=await (await twtichApi.oidcClient).authorizationUrl(
            
        )


    }
}