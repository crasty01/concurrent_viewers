import { Deta } from "deta";
import { BaseClient, Issuer } from "openid-client";
import Base from "deta/dist/types/base";
import dayjs, { Dayjs } from "dayjs";
import crypto from "crypto";

const SessionBase = "_sessions";
const ACLBase = "_authacl";

const expireDuration = dayjs.duration({ hours: 2 }).asSeconds();

interface ACLData {
  key: string; // same as uid in SessionData
  allowedChannels: string[];
}

async function OIDCClient(
  client_id: string,
  client_secret: string,
  accessUrl: string
) {
  const iss = await Issuer.discover("https://id.twitch.tv/oauth2");

  return new iss.Client({
    client_id,
    client_secret,
    redirect_uris: [accessUrl],
    response_types: ["code"],
  });
}

interface SessionData {
  key: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  trustedUntil: string; //datetime in iso8601 format
}

function generateRandSession(entropy: number) {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(entropy, (err, buff) => {
      if (err != null) {
        reject(err);
      }
      resolve(buff.toString("base64url"));
    });
  });
}

async function revalidateToken(access_token: string) {
  const resp = await fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    headers: {
      Authorization: `OAuth ${access_token}`,
    },
  });
  switch (resp.status) {
    case 200:
      return true;
    case 401:
      return false;
    default:
      throw new Error(`${resp.status} - ${resp.statusText}`);
  }
}

export class SessionService {
  #sessions: Base;

  accessUrl: string;
  #client_id: string;
  #client_secret: string;
  constructor(
    projectKey: string | undefined,
    accessUrl: string,
    client_id: string,
    client_secret: string
  ) {
    const base = Deta(projectKey);
    this.#sessions = base.Base(SessionBase);

    this.accessUrl = accessUrl;
    this.#client_id = client_id;
    this.#client_secret = client_secret;
  }

  async ValidateToken(sessionToken: string): Promise<string | undefined> {
    if (sessionToken == "") {
      return undefined;
    }

    const data = (await this.#sessions.get(sessionToken)) as any as SessionData;

    if (data == null) {
      return undefined;
    }
    if (
      dayjs().isAfter(dayjs(data.trustedUntil)) &&
      !await this.#ValidateAndRefresh(data)
    ) {
      return undefined;
    }

    return data.user_id;
  }

  async #ValidateAndRefresh(data: SessionData): Promise<boolean> {

    if (await revalidateToken(data.access_token)) {

      await this.#sessions.update(
        {
          trustedUntil: dayjs().add(1, "hour").toISOString(),
        },
        data.key,
        {
          expireIn: expireDuration,
        }
      );
      return true;
    }

    try {
      const refresh = await (
        await this.oidcClient()
      ).refresh(data.refresh_token);

      await this.#sessions.update(
        {
          access_token: refresh.access_token,
          refresh_token: refresh.refresh_token,
          trustedUntil: dayjs().add(1, "hour").toISOString(),
        },
        data.key,
        {
          expireIn: expireDuration,
        }
      );
      return true;
    } catch (e) {

      await this.#sessions.delete(data.key);
      return false;
    }
  }

  async CreateToken(
    user_id: string,
    access_token: string,
    refresh_token: string
  ) {
    const payload: SessionData = {
      key: await generateRandSession(24),
      access_token,
      refresh_token,
      user_id,
      trustedUntil: dayjs().add(1, "hour").toISOString(),
    };
    await this.#sessions.put(payload as any, undefined, {
      expireIn: expireDuration,
    });

    return payload.key;
  }

  async RemoveToken(sessionToken: string) {
    const sess = (await this.#sessions.get(sessionToken)) as any as SessionData;
    if (sess == null) {
      return;
    }
    await Promise.all([
      fetch("https://id.twitch.tv/oauth2/revoke", {
        method: "POST",
        body: new URLSearchParams({
          client_id: this.#client_id,
          token: sess.access_token,
        }),
      }),
      this.#sessions.delete(sessionToken),
    ]);
  }

  #oidc_singleton: Promise<BaseClient> | undefined;
  oidcClient() {
    if (this.#oidc_singleton === undefined) {
      this.#oidc_singleton = OIDCClient(
        this.#client_id,
        this.#client_secret,
        this.accessUrl
      );
    }

    return this.#oidc_singleton;
  }
}

export class AuthService {
  #acls: Base;
  constructor(projectKey: string | undefined) {
    const base = Deta(projectKey);
    this.#acls = base.Base(ACLBase);
  }

  async getACLDataByID(id: string): Promise<ACLData | null> {
    return (await this.#acls.get(id)) as any as ACLData;
  }

  async GetAuthorizedChannels(UID: string): Promise<Array<string> | null> {
    const acls = await this.getACLDataByID(UID);
    if (acls == null) {
      return null;
    }
    return acls.allowedChannels;
  }

  async SetAllowedChannels(UID: string, channels: string[]): Promise<void> {
    const payload = {
      key: UID,
      allowedChannels: channels,
    };

    await this.#acls.put(payload);
  }
}
