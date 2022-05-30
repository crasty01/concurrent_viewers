import { apiUrl } from "./backend.json";
import type { WeekStat } from "./fetch";

import { sessionToken as sessTokenStore } from "./stores";

export interface keyedWeekBucket extends WeekStat {
  key: string;
}

interface dataQuery {
  limit?: number;
  lastID?: string;
}

interface ChannelData {
  lastID: string;
  metrics: keyedWeekBucket[];
}

function droplocalStorage(){

    sessTokenStore.set(null);
    localStorage.removeItem("sessionToken");
}

export const logout = async (sessionToken: string) => {
  const response = await fetch(`${apiUrl}/logout`, {
    method:"POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  droplocalStorage()
};

export const fetchAvailableChannels = async (sessionToken: string) => {
  const response = await fetch(`${apiUrl}/channel-admin/channels-available`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    switch (response.status) {
      case 401:
        droplocalStorage()
        throw new Error("session ended");
      default:
        throw new Error();
    }
  }
  return (await response.json()) as string[];
};
export const fetchChannelmertics = async (
  sessionToken: string,
  channel: string,
  query: dataQuery | undefined = undefined
) => {
  const queryString = new URLSearchParams(query as any);
  const response = await fetch(
    `${apiUrl}/channel-admin/channel/${channel}?${queryString.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error("not found");
      case 401:
        
        droplocalStorage()
        throw new Error("session ended");
      default:
        throw new Error();
    }
  }
  return (await response.json()) as ChannelData;
};

export const updateTarget = async (
  sessionToken: string,
  channel: string,
  weekId: string,
  target: number
) => {
  const response = await fetch(
    `${apiUrl}/channel-admin/channel/${channel}/week/${weekId}/target`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ target }),
    }
  );
  if (!response.ok) {
    switch (response.status) {
      case 401:
        sessTokenStore.set(null);
        throw new Error("session ended");
      default:
        throw new Error();
    }
  }
};
