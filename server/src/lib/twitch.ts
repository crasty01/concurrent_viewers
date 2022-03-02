// POST https://id.twitch.tv/oauth2/token?client_id=uo6dggojyb8d6soh92zknwmi5ej1q2&client_secret=nyo51xcdrerl8z9m56w9w6wg&grant_type=client_credentials

import fetch from 'node-fetch';
import type { RequestInit, Response } from 'node-fetch';




interface Data {
  access_token: string;
  expires_in: number;
  token_type: 'bearer';
}

export const createApiClient = async (clientId: string, clientSecret: string) => {
  const data: Data = await fetchToken(clientId, clientSecret);
  return new Api(data.access_token, clientId, clientSecret);
}

const fetchToken = async (clientId: string, clientSecret: string): Promise<Data> => await (await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'post', })).json();



export class Api {
  #baseUrl = 'https://api.twitch.tv/helix/';

  #accessToken: string;
  #clientId: string;
  #clientSecret: string;

  static createApiClient = createApiClient;

  fetchToken = fetchToken;

  constructor(accessToken: string, clientId: string, clientSecret: string) {
    this.#accessToken = accessToken;
    this.#clientId = clientId;
    this.#clientSecret = clientSecret;
  }

  async #fetch(url: string, options: RequestInit = {}, token: string = this.#accessToken): Promise<Response> {
    console.log(`${this.#baseUrl}${url}`)
    const res: Response = await fetch(`${this.#baseUrl}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Client-ID': this.#clientId,
        Authorization: `Bearer ${this.#accessToken}`,
      }
    });
    if (res.status === 401) return this.#fetch(url, options, (await this.fetchToken(this.#clientId, this.#clientSecret)).access_token);
    if (res.status === 200) return res;
    throw new Error(`[Api#fetch] : ${res.status} - ${res.statusText}`);
  }

  async getStreambyLogin(user_login: string) {
    return (await this.#fetch(`streams?user_login=${user_login}`)).json()
  }
}