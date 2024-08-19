
import express from 'express';
import cors from "cors";
import generateRandomCinemaItems from './mockData';

const cinemaServer = express();

export interface ICinemaItem {
    id: string;
    name: string;
    location: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    programID: string;
}
const CinemaItems: ICinemaItem[] =  generateRandomCinemaItems(10);


export default function initCinemaServer(port: string): void {
    
    cinemaServer.use(cors());
    
    cinemaServer.get('/cinemas', (req, res) => {
        res.json(CinemaItems);
    });

    cinemaServer.get('/cinemas/:id', (req, res) => {
        const cinema = CinemaItems.find((item) => item.id === req.params.id);
        if (cinema) {
            res.json(cinema);
        } else {
            res.send('Cinema not found');
        }
    });

    
        
    cinemaServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
}