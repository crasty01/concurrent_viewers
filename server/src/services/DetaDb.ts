import { getIsoYearWeek } from "$/lib/util";
import type { weekBucket } from "$/lib/util";
import dayjs from "dayjs";
import { Deta } from "deta";
import { GetResponse } from "deta/dist/types/types/base/response";


interface ChannelMetrics {
  name: string; // channel name
  WeeklyMetrics: {
    [isoYearWeek: number]: weekBucket;
  };
}

export class DetaDatabaseService {
  /**
   *
   * Interface to Deta project
   *
   * Base name shall be the name of the channel
   * data entry shall be the type of {{weekBucket}} with the key denoting ISO week year number
   *
   */
  #deta;

  #allowedChannels: Set<string>;

  constructor(projectKey: string| undefined, channels: Array<string>) {
    this.#deta = Deta(projectKey);
    this.#allowedChannels = new Set(channels);
  }
  /**
   * @param channelName Channel name for which we want to get metrics
   * @returns ChannelMetrics object or null, if channel with the provided name does not exists
   */
  async getChannelMetric(channelName: string): Promise<ChannelMetrics | null> {
    if (!this.#allowedChannels.has(channelName)) return null;

    const base = this.#deta.Base(channelName);

    const _res = await Promise.allSettled([
      base.get(getIsoYearWeek(dayjs()).toString()),
      base.get(getIsoYearWeek(dayjs().subtract(1, 'week')).toString()),
    ])

    const res = _res.filter(e => e.status === "fulfilled").map(e => {
      const r = (e as PromiseFulfilledResult<GetResponse>).value;
      return r ? [r?.key, {
        sum: r?.sum,
        count: r?.count,
      }] : [null, null]
    })


    return {
      name: channelName,
      WeeklyMetrics: Object.fromEntries(res)
    }
  }
  /**
   *
   * @param channelName Channel for which we need to add metrics
   * @param timestamp timestamp of when the measurement was done
   * @param count how many viewers were during the measurement
   * @returns Metric has been added sucessfuly
   */
  async addMetric(
    channelName: string,
    timestamp: Date,
    count: number
  ): Promise<boolean> {
    if (!this.#allowedChannels.has(channelName)) {
      return false;
    }

    const base = this.#deta.Base(channelName);
    const dt = getIsoYearWeek(dayjs(timestamp))

    try {
      await base.update({
        "sum": base.util.increment(count),
        "count": base.util.increment(1),
      }, dt.toString())
    } catch (err) {
      await base.insert({
        key: dt.toString(),
        count: 1,
        sum: count,
      })
    }
    return true
  }
  /**
   *
   * @returns A list of all channels in database
   */
  getChannelList(): Array<string> {
    return [...this.#allowedChannels]
  }
}
