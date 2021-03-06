// const API_BASE = import.meta.env.API_BASE || 'http://localhost:8000';

import { apiUrl } from "./backend.json";

export interface WeekStat {
  count: number;
  sum: number;
  target: number;
  average: number;
}
export interface Data {
  current: WeekStat;
  last: WeekStat;
}

export const fetchCurrentDateMetric = async (
  channel: string
): Promise<WeekStat> => {
  const response = await fetch(`${apiUrl}/channel/${channel}/week-current`);
  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error("not found");
      default:
        throw new Error();
    }
  }
  return (await response.json()) as WeekStat;
};


