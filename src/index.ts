import * as dotenv from 'dotenv'; 
import initMovieServer from './TrailerServer/initMovieServer'; 
import initCinemaServer from './CinemaServer/initCinemaServer'; 

dotenv.config(); // Load environment variables from .env file

const portTrailer = process.env.PORT_TRAILER || "1000";
initMovieServer(portTrailer); // Initialize the movie server on the specified port

const portCinema = process.env.PORT_CINEMA || "2000";
initCinemaServer(portCinema); // Initialize the cinema server on the specified port