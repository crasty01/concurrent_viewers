import { FastifyRequest, FastifyReply } from "fastify";
import { generators } from "openid-client";
import { AuthService, SessionService } from "$/services/Auth";

//POST /logout
export function logout(SessionSvc: SessionService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await SessionSvc.RemoveToken(request.authToken);

    return "";
  };
}

//GET /login
export function Login(SessionSvc: SessionService) {
  return async (
    request: FastifyRequest<{ Querystring: { redirect: string } }>,
    reply: FastifyReply
  ) => {
    const ReqRedirect = request.query.redirect;
    if (ReqRedirect) {
      reply.setCookie("redirectURL", ReqRedirect, {
        path: "/login/twitch",
        httpOnly: true,
      });
    }

    const nonce = generators.nonce();

    reply.setCookie("nonce", encodeURI(nonce), {
      path: "/login/twitch",
      httpOnly: true,
    });

    const AuthUrl = (await SessionSvc.oidcClient()).authorizationUrl({
      response_types: ["code"],
      scope: "openid",
      nonce,
    });
    reply.redirect(AuthUrl);
  };
}

//GET /login/twitch
export function LoginTwitchCallback(sess: SessionService, auth: AuthService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const redirect = request.cookies.redirect;
    reply.clearCookie("redirectURL", {
      path: "/login/twitch",
      httpOnly: true,
    });
    reply.clearCookie("nonce", {
      path: "/login/twitch",
      httpOnly: true,
    });
    const client = await sess.oidcClient();

    const params = client.callbackParams(request.url);
    const tokenSet = await client.callback(sess.accessUrl, params, {
      nonce: decodeURI(request.cookies.nonce),
    });
    const claims = tokenSet.claims();
    if ((await auth.getACLDataByID(claims.sub)) == null) {
      reply.code(403);
      return new Error("You Are not authorized to access this service");
    }

    const token = await sess.CreateToken(
      claims.sub,
      tokenSet.access_token!,
      tokenSet.refresh_token!
    );

    if (redirect) {
      reply.redirect(`${redirect}#access_token=${token}`);
      return "";
    }
    return { token };
  };
}
