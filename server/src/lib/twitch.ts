// POST https://id.twitch.tv/oauth2/token?client_id=uo6dggojyb8d6soh92zknwmi5ej1q2&client_secret=nyo51xcdrerl8z9m56w9w6wg&grant_type=client_credentials

import fetch from "node-fetch";
import type { RequestInit, Response } from "node-fetch";
import assert from "assert";
import { BaseClient, Issuer } from "openid-client";

interface Data {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
}

const fetchToken = async (
  clientId: string,
  clientSecret: string
): Promise<Data> =>
  await (
    await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "post" }
    )
  ).json();

export class Api {
  #baseUrl = "https://api.twitch.tv/helix";

  #accessToken: Promise<Data> | null;
  #clientId: string;
  #clientSecret: string;

  #accessUrl: string;

  oidcClient :Promise<BaseClient>;

  constructor(clientId: string, clientSecret: string, accessUrl: string) {
    this.#accessToken = null;
    this.#clientId = clientId;
    this.#clientSecret = clientSecret;
    this.#accessUrl = accessUrl;
    this.oidcClient = this.OIDCClient();
  }

  async getAccessToken(): Promise<string> {
    while (!this.#accessToken) {
      console.log("getting new token");
      this.#accessToken = fetchToken(this.#clientId, this.#clientSecret);
      const t = await this.#accessToken;
      setTimeout(() => {
        this.#accessToken = null;
      }, Math.max(t.expires_in,Math.pow(2, 31)-1));
    }
    const p= this.#accessToken
    return (await p).access_token;
  }

  async #fetch(url: string, options: RequestInit = {}): Promise<Response> {
    for (var tries = 0; tries < 5; tries++) {
      const res: Response = await fetch(`${this.#baseUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          "Client-ID": this.#clientId,
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });
      switch (res.status) {
        case 401:
          this.#accessToken=null;
          break;
        case 200:
          return res;

        default:
          assert.ok(false, `[Api#fetch] : ${res.status} - ${res.statusText}`);
      }
    }
    assert.ok(false, "[Api#fetch] : retry count exceded");
  }

  async getStreambyLogin(...user_login: Array<string>) {
    assert.ok(user_login.length > 0, "No user_login provided!");
    assert.ok(user_login.length < 100, "Max length of user_login is 100!");
    const query = new URLSearchParams(user_login.map((e) => ["user_login", e]));
    const resp= await this.#fetch(`/streams?${query.toString()}`)
    const t={
      lim: resp.headers.get("Ratelimit-Limit"),
      remains: resp.headers.get("Ratelimit-Remaining"),
      reset: resp.headers.get("Ratelimit-Reset"),
    }
    console.log("Response counters: ",t)
    return await resp.json()
  }

  async OIDCClient() {
    const iss = await Issuer.discover("https://id.twitch.tv/oauth2");

    return new iss.Client({
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
      redirect_uris: [this.#accessUrl],
    });
  }
}
