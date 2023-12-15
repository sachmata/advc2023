import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';
import zip from '../lib/zip.mjs';
import cyrb53 from '../lib/cyrb53.mjs';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 14 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/14/input

let data = [];

for (let line of fromFile(`./day14/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    data.push(line.split(''));
}

// -1 backward, 1 forward
function tilt(offset, data) {
    for (let line of data) {
        let moved;
        do {
            moved = false;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === 'O' && line[i + offset] === '.') {
                    line[i] = '.';
                    line[i + offset] = 'O';
                    moved = true;
                }
            }
        } while (moved);
    }
}

function getLoad(data) {
    return data.reduce((acc, row, i, d) => {
        acc += row.filter(v => v === 'O').length * (d.length - i);
        return acc;
    }, 0);
}

function tiltCycle(data) {
    let cols = zip(...data);
    tilt(-1, cols); // north

    let rows = zip(...cols);
    tilt(-1, rows); // west

    cols = zip(...rows);
    tilt(1, cols); // south

    rows = zip(...cols);
    tilt(1, rows); // east

    return rows;
}

const cols = zip(...data);
tilt(-1, cols); // north
const lData = zip(...cols);

console.log(getLoad(lData)); // part 1

const seen = new Map();
const iter = [];

while (true) {
    const cData = tiltCycle(seen.get(iter.at(-1)) ?? data);
    const cHash = cyrb53(cData.map(r => r.join('')).join(''));

    iter.push(cHash);

    if (seen.has(cHash)) {
        break;
    }
    seen.set(cHash, cData);
}

const TOTAL_ITER = 1e9;

const lHash = iter.at(-1);
const first = iter.indexOf(lHash);
const cycle = iter.length - 1 - first;
const tIndex = ((TOTAL_ITER - first) % cycle) + first - 1;
const tData = seen.get(iter[tIndex]);
const tLoad = getLoad(tData);

console.log(tLoad); // part 2

console.log('End');
