import axios, { AxiosResponse } from "axios";


export interface IMovieListResponse {
  description: string;
  id: number;
  iso_639_1: string;
  item_count: number;
  items: IMovieItem[];
  name: string;
  page: number;
}

export interface IMovieItem {
  id: number;
  overview: string;
  poster_path: string;
  title: string;
}

export default function getMoviesFromAPI<R extends {items:P},P>(url:string,key:string): Promise<P |never[]> {
  const promise = axios.get<R>(url,{
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
  const dataPromise : Promise<P |never[]> = promise.then((response:AxiosResponse<R>) => response.data.items).catch(()=> []);
  return dataPromise;
}