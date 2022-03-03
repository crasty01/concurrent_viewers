import {
  DatabaseService,
  ChannelMetrics,
  weekBucket
} from "$/services/Interfaces/databaseService";
import { Deta } from "deta";


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
    throw new Error("Not implemented yet.");
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
    throw new Error("Not implemented yet.");
  }
  /**
   *
   * @returns A list of all channels in database
   */
  GetChannelList(): Promise<string[]> {
    throw new Error("Not implemented yet.");
  }
}
