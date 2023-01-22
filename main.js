//TODOS
//1.only display closest 2 stops bus arrivals ✔
//2. will need to slice busstopsinradius, line 13 ✔
//3. pair each bus stop with the relevant bus info - at the moment showing in succession ✔

//5.implement a radius user input funcionality
//6.display 0 min as due
//7. try to refactor the code
//8. deal with API not sending info back

import { closestBusStops } from './busStopFinder.js'

async function nextBuses() {

    const busStopsInRadius = await closestBusStops();

    for (let stop of busStopsInRadius) {
        const busesServingStopResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/${stop.naptanId}/Arrivals`)
        const busesServingStopJSON = await busesServingStopResponse.json();
        const busInfo = busesServingStopJSON
            .sort((busA, busB) => busA.timeToStation - busB.timeToStation)
            .map(bus => [bus.lineId, bus.towards, Math.round(bus.timeToStation / 60)]);

        const busesToDisplay = busInfo.length <= 4 ? busInfo.length : 4;
        console.log(`The next buses arriving to ${stop.commonName} (${stop.stopLetter})`);
        if (busesToDisplay == 0 || busesToDisplay == undefined) {
            console.log("There are no buses arriving right now.")

        } else {
            for (let i = 0; i < busesToDisplay; i++) {
                //setting the suffixes for counting, '1st', '2nd' etc
                let ordinalSuffix = 'th';
                switch (i) {
                    case 0:
                        ordinalSuffix = 'st';
                        break;
                    case 1:
                        ordinalSuffix = 'nd';
                        break;
                    case 2:
                        ordinalSuffix = 'rd';
                        break;
                    default:
                        ordinalSuffix = 'th'
                }

                if (busInfo[i][2] < 2) {
                    console.log(`The ${i + 1}${ordinalSuffix} bus is the ${busInfo[i][0]} towards ${busInfo[i][1]} and is now due.`)
                } else {
                    console.log(`The ${i + 1}${ordinalSuffix} bus is the ${busInfo[i][0]} towards ${busInfo[i][1]} and is arriving in ${busInfo[i][2]} minutes.`)
                }
            }
        }
    }
}

nextBuses();