import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 18 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/18/input

const INPUT_REGEX = /([UDRL])\s(\d+)\s\((#[0-9a-f]+)\)/g;

const DIR = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
};

const plan = [];
for (let line of fromFile(`./day18/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const matches = INPUT_REGEX.exec(line);
    if (!matches) {
        continue;
    }

    plan.push({ dir: matches[1], steps: matches[2], color: matches[3] });
}
console.log(plan);

console.log('End');
