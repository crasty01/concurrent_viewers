import dayjs, { Dayjs } from "dayjs";
import isoweek from "dayjs/plugin/isoWeek";

dayjs.extend(isoweek);

export interface weekBucket {
  sum: number;
  count: number;
  target: number;
}

export function getIsoYearWeek(d: Dayjs): number {
  const t = dayjs(d);
  return t.isoWeekYear() * 100 + t.isoWeek();
}
