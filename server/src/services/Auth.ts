import { Deta } from "deta";
import { Issuer } from "openid-client";
import Base from "deta/dist/types/base";

const sessionsBase = "_sessions";
const ACLBase = "_authacl";

interface ACLData {
  key: string; // same as uid in SessionData
  allowedChannels: string[];
}

interface SessionData {
  key: string;
  uid: string;
}


export class AuthService {
  #acls: Base;
  #sessions: Base;

  constructor(projectKey: string | undefined) {
    const base = Deta(projectKey);

    this.#acls = base.Base(ACLBase);
    this.#sessions = base.Base(sessionsBase);
  }

  async AuthorizeForChannel(token: string, channel: string): Promise<boolean> {
    const chans = await this.GetAuthorizedChannels(token);
    if (!chans) {
      return false;
    }
    return chans.has(channel);
  }

  async GetAuthorizedChannels(token: string): Promise<Set<string> | null> {
    const sessData = (await this.#sessions.get(token)) as any as SessionData;
    if (!sessData) {
      return null;
    }

    const acls = (await this.#acls.get(sessData.uid)) as any as ACLData;
    if (!acls) {
      return new Set<string>();
    }
    return new Set(acls.allowedChannels);
  }

  async SetAllowedChannels(UID: string, channels: string[]): Promise<void> {
    const payload = {
      key: UID,
      allowedChannels: channels,
    };

    await this.#acls.put(payload);
  }

  async login() {


    
  }
}
