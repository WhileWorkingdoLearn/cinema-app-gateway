import express from 'express';
import cors from "cors";
import { getTrailers, IMovieItem, IMovieListResponse } from './tmdb_api_client';
import { getMoviesFromAPI } from './tmdb_api_client';

const cachedMovies :Map<string,IMovieItem[]> = new Map();
const trailerServer = express();

export default function initMovieServer(portMovies:string) {
    const movieListPath = process.env.TMDB_MOVIE_LIST;
    const apiReaderKey = process.env.TMDB_READERKEY;

    if (!movieListPath || !apiReaderKey) {
        throw new Error('Environment variables TMDB_MOVIE_LIST and API_READER_KEY must be set');
    }

    trailerServer.use(cors());

    trailerServer.get('/movies/:id',async (req, res) => {
        const movieId = req.params.id;

        if (!movieId) {
            return res.status(400).send('Movie ID is required');
        }

        if(cachedMovies.has(movieId)){
            console.log("in Cache");
            res.json(cachedMovies.get(movieId));
        } else {
            const movies = getMoviesFromAPI<IMovieListResponse,IMovieItem[]>(movieListPath,apiReaderKey);
            movies.then((data)=> res.json(data));
            movies.catch((err) => {
            res.send('Internal Server Error');
        })
        }

    });

    const trailerListPath = process.env.TMDB_TRAILER_LIST;
    
    if (!trailerListPath) {
        throw new Error('Environment variable TMDB_TRAILER_LIST must be set');
    }

    trailerServer.get('/movies/trailers/:id', async(req, res) => {
        const url = trailerListPath + req.params.id + "/videos";

        console.log(url);
        
        const trailers =  getTrailers(url,apiReaderKey,'YouTube');

        res.json(trailers);
    });

    trailerServer.get('/movies/pictures', (req, res) => {
        res.send('Hello, Pictures');
    });


    trailerServer.listen(portMovies, () => {
    console.log(`Server is running on http://localhost:${portMovies}`);

    //First Parameter Interface needs to have 'items' property of type P
    const movies = getMoviesFromAPI<IMovieListResponse,IMovieItem[]>(movieListPath,apiReaderKey);
    movies.then((data)=>{ cachedMovies.set("123456789",data);
        console.log("Movies loaded");
    });
    });

}