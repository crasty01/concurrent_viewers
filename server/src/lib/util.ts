import dayjs, { Dayjs } from "dayjs";
import isoweek from "dayjs/plugin/isoWeek";
import duration from "dayjs/plugin/duration";

dayjs.extend(isoweek);
dayjs.extend(duration);

export interface weekBucket {
  sum: number;
  count: number;
  target: number;
}

export function getIsoYearWeek(d: Dayjs): number {
  const t = dayjs(d);
  return t.isoWeekYear() * 100 + t.isoWeek();
}
