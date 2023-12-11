import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 9 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/9/input

let sum1 = 0;
let sum2 = 0;

for (let line of fromFile(`./day09/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const deltas = [line.split(' ').map(Number)];

    while (deltas.at(-1).some(v => v)) {
        const current = deltas.at(-1);

        const delta = [];
        for (let i = 1; i < current.length; i++) {
            delta.push(current[i] - current[i - 1]);
        }

        deltas.push(delta);
    }

    deltas.at(-1).push(0);

    for (let i = deltas.length - 2; i >= 0; i--) {
        const current = deltas[i];
        const prev = deltas[i + 1];
        current.push(current.at(-1) + prev.at(-1));
        current.unshift(current.at(0) - prev.at(0));
    }

    // console.log(deltas);

    sum1 += deltas[0].at(-1);
    sum2 += deltas[0].at(0);
}

console.log(sum1);
console.log(sum2);

console.log('End');
