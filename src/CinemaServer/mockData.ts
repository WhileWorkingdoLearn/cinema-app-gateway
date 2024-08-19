import { ICinemaItem } from './initCinemaServer';

function getRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default function generateRandomCinemaItems(count: number): ICinemaItem[] {
    const cinemaItems: ICinemaItem[] = [];
    for (let i = 0; i < count; i++) {
        cinemaItems.push({
            id: getRandomString(10),
            name: `Cinema ${getRandomString(5)}`,
            location: {
                address: `${Math.floor(Math.random() * 1000)} Random Street`,
                city: 'Berlin',
                postalCode: `10${Math.floor(Math.random() * 900) + 100}`,
                country: 'Germany'
            },
            programID: getRandomString(8)
        });
    }
    return cinemaItems;
}

