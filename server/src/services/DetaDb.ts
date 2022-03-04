import { getIsoYearWeek } from "$/lib/util";
import {
  DatabaseService,
  ChannelMetrics,
  weekBucket,
} from "$/services/Interfaces/databaseService";
import dayjs from "dayjs";
import { Deta } from "deta";

interface keyedWeekBucket extends weekBucket {
  key: number;
}

export class DetaDatabaseService implements DatabaseService {
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

  constructor(projectKey: string, channels: Array<string>) {
    this.#deta = Deta(projectKey);
    this.#allowedChannels = new Set(channels);
  }

  /**
   * @param channelName Channel name for which we want to get metrics
   * @returns ChannelMetrics object or null, if channel with the provided name does not exists
   */
  async GetChannelMetric(channelName: string): Promise<ChannelMetrics | null> {
    if (!this.#allowedChannels.has(channelName)) {
      return null;
    }

    const base = this.#deta.Base(channelName);

    const resp = (await base.fetch()).items;

    const response = {
      name: channelName,
      WeeklyMetrics: {},
    } as ChannelMetrics;

    for (const x of resp as unknown[] as keyedWeekBucket[]) {
      response.WeeklyMetrics[x.key] = x;
    }

    return response;
  }
  /**
   *
   * @param channelName Channel for which we need to add metrics
   * @param timestamp timestamp of when the measurement was done
   * @param count how many viewers were during the measurement
   * @returns Metric has been added sucessfuly
   */
  async AddMetric(
    channelName: string,
    timestamp: Date,
    count: number
  ): Promise<boolean> {
    if (!this.#allowedChannels.has(channelName)) {
      return false;
    }

    const base = this.#deta.Base(channelName);
    const dt= getIsoYearWeek(dayjs(timestamp))

    try{
      await base.update({
        "sum": base.util.increment(count),
        "count": base.util.increment(1),
      },dt.toString())
    }catch (err){
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
  async GetChannelList(): Promise<string[]> {
    return new Array(...this.#allowedChannels);
  }
}
