import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 13 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/13/input

const patterns = [];

let currentPattern = [];

for (let line of fromFile(`./day13/${FILE_NAME}.txt`)) {
    if (line.length) {
        currentPattern.push(line);
    } else {
        patterns.push({ h: currentPattern });
        currentPattern = [];
    }
}

if (currentPattern.length) {
    patterns.push({ h: currentPattern });
    currentPattern = [];
}

for (let pattern of patterns) {
    const size = pattern.h[0].length;
    pattern.v = [];

    for (let i = 0; i < size; i++) {
        const v = [];

        for (let h of pattern.h) {
            v.push(h[i]);
        }

        pattern.v.push(v.join(''));
    }
}

function diff(a, b) {
    let err = 0;
    for (let i = 0; i < a.length; i++) {
        err += a[i] !== b[i];
    }
    return err;
}

const ERR = 1; //0; // part 2

function findMirrorLines(data) {
    for (let cursor = 0; cursor < data.length - 1; cursor++) {
        let cA = cursor;
        let cB = cursor + 1;
        let err = 0;

        while (true) {
            err += diff(data[cA], data[cB]);

            if (err > ERR) {
                break;
            }

            if (cA === 0 || cB === data.length - 1) {
                // exactly one smudge
                if (err < ERR) {
                    break;
                }

                return cursor + 1; // result
            }

            cA--;
            cB++;
        }
    }

    return 0;
}

let sum = 0;

for (let pattern of patterns) {
    const hLines = findMirrorLines(pattern.h);
    const vLines = findMirrorLines(pattern.v);

    sum += hLines * 100 + vLines;
}

console.log(sum);

console.log('End');
