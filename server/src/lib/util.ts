
import dayjs, { Dayjs } from "dayjs";

import isoweek from "dayjs/plugin/isoWeek";
// import { channel } from "diagnostics_channel";

dayjs.extend(isoweek);


export function getIsoYearWeek(d: Dayjs):number{
    const t = dayjs(d);
    return t.isoWeekYear() * 100 + t.isoWeek();
}