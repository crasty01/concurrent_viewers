import {
  DatabaseService,
  ChannelMetrics,
} from "$/services/Interfaces/databaseService";
import { getIsoYearWeek } from "$/lib/util";
import dayjs from "dayjs";

export class InMemoryDb implements DatabaseService {
  #internalData: { [key: string]: ChannelMetrics } = {};

  constructor(channels: string[]) {
    for (const chan of channels) {
      this.#internalData[chan] = {
        name: chan,
        WeeklyMetrics: {},
      };
    }
  }
  async GetChannelMetric(channelName: string) {
    const data = this.#internalData[channelName];
    if (!data) {
      return null;
    }
    return data;
  }

  async GetChannelList() {
    return Object.keys(this.#internalData);
  }

  async AddMetric(channelName: string, timestamp: Date, count: number) {
    const isoYearWeek = getIsoYearWeek(dayjs(timestamp));
    const ch = await this.GetChannelMetric(channelName);
    if (!ch) {
      // feng sui would ask us to throw exception here
      return false;
    }

    let weekDay = ch.WeeklyMetrics[isoYearWeek];

    if (!weekDay) {
      weekDay = {
        sum: 0,
        count: 0,
      };
      ch.WeeklyMetrics[isoYearWeek] = weekDay;
    }

    weekDay.count++;
    weekDay.sum+=count;

    return true;
  }
}
