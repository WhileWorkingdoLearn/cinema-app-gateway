import express from 'express';
import cors from "cors";
import {getMoviesFromAPI, getTrailers, IMovieItem, IMovieListResponse, } from './app/tmdb_api_client';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 1000;
const cachedMovies :Map<string,IMovieItem[]> = new Map();

const movieListPath = process.env.TMDB_MOVIE_LIST || '';
const apiReaderKey = process.env.TMDB_READERKEY || '';
const apiKey = process.env.TMDB_APIKEY || '';

app.use(cors());

app.get('/movies/:id',async (req, res) => {
    if(cachedMovies.has(req.params.id)){
      console.log("in Cache");
      res.json(cachedMovies.get(req.params.id));
    } else {
      const movies = getMoviesFromAPI<IMovieListResponse,IMovieItem[]>(movieListPath,apiReaderKey);
      movies.then((data)=> res.json(data));
      movies.catch((err) => {
        res.send('Internal Server Error');
      })
    }

});


const trailerListPath = process.env.TMDB_TRAILER_LIST || '';

app.get('/movies/trailers/:id', async(req, res) => {
    const url = trailerListPath + req.params.id + "/videos";

    console.log(url);
    
    const trailers =  getTrailers(url,apiReaderKey,'YouTube');

    res.json(trailers);
});

app.get('/movies/pictures', (req, res) => {
    res.send('Hello, Pictures');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  //First Parameter Interface needs to have 'items' property of type P
  const movies = getMoviesFromAPI<IMovieListResponse,IMovieItem[]>(movieListPath,apiReaderKey);
  movies.then((data)=>{ cachedMovies.set("123456789",data);
    console.log("Movies loaded");
  });
});


export default app;