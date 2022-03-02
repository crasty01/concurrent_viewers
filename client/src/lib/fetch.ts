const BASE_URL = import.meta.env.DEV ? 'http://localhost:8080' : 'http://localhost:8080';



export interface Data {
  channel: string;
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
  const { data, error } = await (await fetch(`${BASE_URL}/${channel}`)).json() as Response;
  if (error) throw new Error(error);
  return data;
}