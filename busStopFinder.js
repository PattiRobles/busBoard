//TO IMPROVE - split into two functions - a) find stops  b) find buses serving the stops
//To do - implement search with new radius input

import { postcodeToCoords } from './postcodeFinder.js';
import readline from 'readline-sync'

export async function closestBusStops() {

    const coords = await postcodeToCoords();

    let radius = '250' //default radius

    const busStopsInRadiusResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coords[0]}&lon=${coords[1]}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`);
    const busStopsInRadiusJSON = await busStopsInRadiusResponse.json();
    const busStopsInRadius = busStopsInRadiusJSON.stopPoints.sort((stopA, stopB) => stopA.distance - stopB.distance).slice(0, 2);
    if (!busStopsInRadius.length) {
        console.log('Sorry, there are no bus stops nearby');
        console.log('Would you like to increase your search area? Type Y / N')
        const increaseArea = readline.prompt().toUpperCase()
        if (increaseArea === 'N') {
            console.log('OK, good luck getting to your destination!')
            process.exit();
        }
        else {
            console.log('Increase search radius by how many meters?')
            radius = +readline.prompt()
            //need to split into two separate funcitions to keep code dry
        }

    }
    else {
        console.log(`Your closest bus stops are:
        ${busStopsInRadius[0].commonName}- stop letter ${busStopsInRadius[0].stopLetter === undefined ? '(not available)' : busStopsInRadius[0].stopLetter}- which is ${Math.trunc(busStopsInRadius[0].distance)}m away
        ${busStopsInRadius[1].commonName}- stop letter ${busStopsInRadius[1].stopLetter === undefined ? '(not available)' : busStopsInRadius[1].stopLetter}- which is ${Math.trunc(busStopsInRadius[1].distance)}m away`)
    }
    return busStopsInRadius;
}