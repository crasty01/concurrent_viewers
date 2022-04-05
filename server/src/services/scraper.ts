import { DetaDatabaseService } from "$/services/DetaDb";
import { Api } from "$/lib/twitch";

function* chunkedArray(array: string[], n: number): Generator<string[]> {
  for (let i = 0; i <= array.length; i += n) {
    yield array.slice(i, i + n);
  }
}

export class Scaper {
  #dbService: DetaDatabaseService;
  #twitchApi: Api;

  constructor(dbService: DetaDatabaseService, twitchApi: Api) {
    this.#dbService = dbService;
    this.#twitchApi = twitchApi;
  }

  async Scrape(): Promise<void> {
    const ts = new Date();

    const chunkedExecute = async (channels: string[]) => {
      const chData = (await this.#twitchApi.getStreambyLogin(...channels))
        .data as Array<{ user_login: string; viewer_count: number }>;

      const channels_data = Object.entries({
        ...Object.fromEntries(channels.map((x) => [x, undefined])),
        ...Object.fromEntries(
          chData.map((x) => [x.user_login, x.viewer_count])
        ),
      });

      const tasks = channels_data.map(([login, count]) =>
        this.#dbService.addMetric(login, ts, count)
      );
      await Promise.all(tasks);
    };
    const tasks = Array(
      ...chunkedArray(this.#dbService.getChannelList(), 100)
    ).map((channels) => chunkedExecute(channels));
    await Promise.all(tasks);
  }
}
