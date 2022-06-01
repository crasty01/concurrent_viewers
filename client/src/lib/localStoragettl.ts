import dayjs from "dayjs";

import isoWeek from "dayjs/plugin/isoWeek"
import duration, { Duration } from "dayjs/plugin/duration";
dayjs.extend(isoWeek);
dayjs.extend(duration);

interface ttlKey {
  value: string;
  expires: string;
}

export function SetItemWithTTL(key: string, value: string, ttl: Duration) {
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expires: dayjs().add(ttl).toISOString(),
    })
  );
}

export function GetItemWithTTL(key: string) {
  const rawValue = localStorage.getItem(key);
  if (rawValue == null) {
    return null;
  }

  const value = JSON.parse(rawValue) as ttlKey;

  if (dayjs().isAfter(dayjs(value.expires))) {
    localStorage.removeItem(key);
    return null;
  }
  return value.value
}
