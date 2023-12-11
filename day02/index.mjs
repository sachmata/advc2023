import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 2 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/2/input

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

let sum = 0;
let powerSum = 0;

for (let line of fromFile(`./day02/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    let [_game, _draws] = line.split(':');
    const game = Number(_game.replace('Game ', ''));
    // console.log(game);

    let gamePossible = true;

    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;

    const draws = _draws.split(';');
    draws.forEach(draw => {
        const cubes = draw.split(',');
        cubes.forEach(_cubes => {
            const [_count, color] = _cubes.trim().split(' ');
            const count = Number(_count);

            switch (color) {
                case 'red':
                    if (count > minRed) {
                        minRed = count;
                    }
                    if (count > MAX_RED) {
                        gamePossible = false;
                    }
                    break;
                case 'green':
                    if (count > minGreen) {
                        minGreen = count;
                    }
                    if (count > MAX_GREEN) {
                        gamePossible = false;
                    }
                    break;
                case 'blue':
                    if (count > minBlue) {
                        minBlue = count;
                    }
                    if (count > MAX_BLUE) {
                        gamePossible = false;
                    }
                    break;
            }
        });
    });

    const power = minRed * minGreen * minBlue;
    // console.log('power', power);
    powerSum += power;

    // console.log('possible', gamePossible);
    if (gamePossible) {
        sum += game;
    }
}

console.log('sum', sum);
console.log('powerSum', powerSum);

console.log('End');
