// const API_BASE = import.meta.env.API_BASE || 'http://localhost:8000';

import {apiUrl} from "./backend.json"

console.log(apiUrl)

export interface Data {
  // channel: string;
  current: {
    sum: number;
    count: number;
    average: number;
  };
  last: {
    sum: number;
    count: number;
    average: number;
  };
}

export interface Response {
  data: Data | null;
  error: string | null;
}

export const fetchData = async (channel: string) => {
  const response = await fetch(`${apiUrl}/${channel}`);
  if (!response.ok){
    switch (response.status){
    case 404:
      throw new Error("not found");
    default:
      
      throw new Error()
    }
  }
  return await response.json() as Data;
}