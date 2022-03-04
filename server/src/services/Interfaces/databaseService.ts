export interface ChannelMetrics {
  /** Channel name*/
  name: string;
  /** Weekly metrics Dict. isoYearWeek should be a number denoting ISO week
   * date format e.g. 202202 would denote a second week of 2022*/
  WeeklyMetrics: {
    [isoYearWeek: number]: weekBucket;
  };
}

export interface weekBucket {
  sum: number;
  count: number;
}

export function ToPayload(wb: weekBucket) {
  return {
    ...wb,
    average: wb.sum / wb.count,
  };
}

//TODO: make it to promises
export interface DatabaseService {
  /**
   * @param channelName Channel name for which we want to get metrics
   * @returns ChannelMetrics object or null, if channel with the provided name does not exists
   */
  GetChannelMetric(channelName: string): Promise<ChannelMetrics | null>;
  /**
   *
   * @param channelName Channel for which we need to add metrics
   * @param timestamp timestamp of when the measurement was done
   * @param count how many viewers were during the measurement
   * @returns Metric has been added sucessfuly
   */
  AddMetric(
    channelName: string,
    timestamp: Date,
    count: number
  ): Promise<boolean>;
  /**
   *
   * @returns A list of all channels in database
   */
  GetChannelList(): Promise<string[]>;
}
