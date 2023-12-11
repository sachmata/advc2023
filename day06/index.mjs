import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 6 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/6/input

const races = [];
const theRace = {};

for (let line of fromFile(`./day06/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    if (line.startsWith('Time:')) {
        races.push(
            ...line
                .substring(5)
                .replace(/\s+/g, ' ')
                .split(' ')
                .map(t => ({ time: Number(t.trim()), winCount: 0 }))
        );

        theRace.time = Number(line.substring(5).replace(/\s+/g, ''));

        continue;
    }

    if (line.startsWith('Distance:')) {
        line.substring(9)
            .replace(/\s+/g, ' ')
            .split(' ')
            .map(d => Number(d.trim()))
            .forEach((d, i) => (races[i].distance = d));

        theRace.distance = Number(line.substring(9).replace(/\s+/g, ''));

        continue;
    }
}

// function raceDistance(buttonTime, raceTime) {
//     const speed = buttonTime;
//     const movingTime = Math.max(0, raceTime - buttonTime);
//     return speed * movingTime;
// }

function raceWinCount(raceTime, distanceToBeat) {
    const d = Math.sqrt(raceTime * raceTime - 4 * distanceToBeat);
    const min = Math.ceil((raceTime - d) / 2);
    const max = Math.floor((raceTime + d) / 2);

    return max - min + 1;
}

for (let race of races) {
    race.winCount = raceWinCount(race.time, race.distance);

    // for (let buttonTime = 1; buttonTime < race.time; buttonTime++) {
    //     const distance = raceDistance(buttonTime, race.time);
    //     if (race.distance < distance) {
    //         race.winCount++;
    //     }
    // }
}

const result = races.reduce((acc, race) => {
    acc *= race.winCount;
    return acc;
}, 1);
console.log(result);

theRace.winCount = raceWinCount(theRace.time, theRace.distance);
console.log(theRace.winCount);

console.log('End');
