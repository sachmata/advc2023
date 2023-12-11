import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 11 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/11/input

// let lineIndex = 0;

let emptyRows = null;
let emptyColumns = null;

const galaxies = [];

let lineIndex = -1;
for (let line of fromFile(`./day11/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    if (!emptyRows) {
        emptyRows = [];
    }

    if (!emptyColumns) {
        emptyColumns = Array.from(Array(line.length).keys());
    }

    lineIndex++;

    const matches = [...line.matchAll(/#/g)];
    if (matches.length) {
        for (let match of matches) {
            emptyColumns = emptyColumns.filter(c => c !== match.index);
            galaxies.push({ x: match.index, y: lineIndex });
        }
    } else {
        emptyRows.push(lineIndex);
    }
}

// console.log(emptyRows);
// console.log(emptyColumns);

const EXPANSION_FACTOR = 1e6; // 2; // part 2
const EXPANSION_OFFSET = 1 * EXPANSION_FACTOR - 1;

emptyRows.reverse();
emptyColumns.reverse();

// universe expansion
for (let emptyRow of emptyRows) {
    for (let galaxy of galaxies) {
        if (galaxy.y > emptyRow) {
            galaxy.y += EXPANSION_OFFSET;
        }
    }
}

for (let emptyColumn of emptyColumns) {
    for (let galaxy of galaxies) {
        if (galaxy.x > emptyColumn) {
            galaxy.x += EXPANSION_OFFSET;
        }
    }
}

// console.log(galaxies);

let sum = 0;

for (let i = 0; i < galaxies.length; i++) {
    const currentGalaxy = galaxies[i];

    for (let j = i + 1; j < galaxies.length; j++) {
        const otherGalaxy = galaxies[j];

        const distance =
            Math.abs(currentGalaxy.x - otherGalaxy.x) + Math.abs(currentGalaxy.y - otherGalaxy.y);

        sum += distance;
    }
}

console.log(sum);

console.log('End');
