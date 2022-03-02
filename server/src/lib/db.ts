import Base from "deta/dist/types/base";
import { Deta } from "deta";
import { env } from "$/lib/env";

export class Database {
  #deta;
  #dbs: { [key: string]: Base } = {};

  constructor(projectKey: string, channels: Array<string>) {

    this.#deta = Deta(projectKey);

    for (const channel of channels) {
      this.upsert(channel);
    }
  }

  public has(_channel: string) {
    const channel = _channel.toLowerCase();
    return this.#dbs.hasOwnProperty(channel);
  }

  public add(_channel: string) {
    const channel = _channel.toLowerCase();
    if (this.has(channel)) return;
    this.#dbs[channel] = this.#deta.Base(channel);
  }

  public get(_channel: string) {
    const channel = _channel.toLowerCase();
    if (!this.has(channel)) return null;
    return this.#deta.Base(channel);
  }

  public upsert(_channel: string) {
    const channel = _channel.toLowerCase();
    if (!this.has(channel)) this.add(channel)
    return this.get(channel)!;
  }

  public get list() {
    return Object.keys(this.#dbs);
  }
}

export const database = new Database(env.DETA_PROJECT_KEY, []);