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



export interface IMovieTrailerRespone{
  id:number,
  results:IMovieTrailer[]
}

export interface IMovieTrailer {
  iso_639_1: string,
  iso_3166_1: string,
  name: string,
  key: string,
  site: string,
  size: number,
  type: string,
  official: boolean,
  published_at: string,
  id: string
}



export function getMoviesFromAPI<R extends {items:P},P>(url:string,key:string): Promise<P> {
  const promise = axios.get<R>(url,{
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
  const dataPromise : Promise<P> = promise.then((response:AxiosResponse<R>) => response.data.items);
  return dataPromise;
}

export function getTrailersFromAPI<R extends {results:P},P>(url:string,key:string): Promise<P> {
  const promise = axios.get<R>(url,{
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
  const dataPromise : Promise<P> = promise.then((response:AxiosResponse<R>) => response.data.results);
  return dataPromise;
}

const youtubePath = process.env.YOUTUBE_VIDEO || '';
const youtubeImage = process.env.YOUTUBE_IMAGE || '';

export function getTrailers(url:string,apiReaderKey:string,filterFor:string):{provider:string,trailerPaths:string[],imagePaths:string[]}{

  const trailers = getTrailersFromAPI<IMovieTrailerRespone,IMovieTrailer[]>(url,apiReaderKey);
  let trailerList:string[] = [];
  let imageList:string[] = [];

   const data = trailers.then((data)=>{ 
       const filteredData = data.filter((value:IMovieTrailer) => {
        return value.type === 'Trailer' && value.site === filterFor;
      });
      trailerList = filteredData.map((trailer)=> {
        return youtubePath + trailer.key;
      });
      imageList = filteredData.map((trailer)=> {
        return youtubeImage + trailer.key + '/default.jpg';
      });
  });

  return {provider:filterFor,trailerPaths:trailerList,imagePaths:imageList}
}