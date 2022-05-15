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

interface keyedWeekBucket extends weekBucket {
  key: string;
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

  constructor(projectKey: string | undefined, channels: Array<string>) {
    this.#deta = Deta(projectKey);
    this.#allowedChannels = new Set(channels);
  }

  /**
   * @param channelName Channel name for which we want to get metrics
   * @param yearWeek date expressed as concatenated ISO 8601 year and week (YYYYWW)
   * @returns weekBucket if we have a channel. data will be set to 0 if we do not have any data for that week yet
   * @returns null if we do not serve the channel
   */
  async getChannelWeekMetric(
    channelName: string,
    yearWeek: number
  ): Promise<weekBucket | null> {
    if (!this.#allowedChannels.has(channelName)) return null;

    const base = this.#deta.Base(channelName);

    const data = (await base.get(yearWeek.toString()
    )) as unknown as keyedWeekBucket | null;

    if (!data) {
      return {
        count: 0,
        sum: 0,
        target: 0,
      };
    }

    return data;
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
    count?: number
  ): Promise<boolean> {
    if (!this.#allowedChannels.has(channelName)) {
      return false;
    }

    const base = this.#deta.Base(channelName);
    const dt = getIsoYearWeek(dayjs(timestamp));

    const updates = {
      sum: 0,
      count: 0,
    };

    if (count) {
      updates.count = 1;
      updates.sum = count;
    }

    try {
      await base.update(
        {
          sum: base.util.increment(updates.sum),
          count: base.util.increment(updates.count),
        },
        dt.toString()
      );
    } catch (err) {
      if ((err as Error).message != "Key not found") {
        throw err;
      }
      const previousWeek = getIsoYearWeek(dayjs(timestamp).subtract(1, "week"));
      const pwData = (await base.get(
        previousWeek.toString()
      )) as unknown as weekBucket;
      const paylaod = {
        key: dt.toString(),
        count: updates.count,
        sum: updates.sum,
        target: 0,
      };
      if (pwData) {
        const pvAverage = Math.round(pwData.sum / pwData.count) || 0;
        paylaod.target = Math.max(pvAverage, pwData.target);
      }
      await base.insert(paylaod);
    }
    return true;
  }
  /**
   *
   * @returns A list of all channels in database
   */
  getChannelList(): Array<string> {
    return [...this.#allowedChannels];
  }
}
