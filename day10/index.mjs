import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 10 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/10/input

let start;
const data = [];

for (let line of fromFile(`./day10/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const row = line.split('');
    const si = row.indexOf('S');
    if (si !== -1) {
        start = { x: si, y: data.length };
    }

    data.push(row);
}

// console.log(data, start);

const DIR_REV = {
    N: 'S',
    S: 'N',
    E: 'W',
    W: 'E',
};

const DIR_DELTA = {
    N: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 },
    S: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
};

const PIPE_MOVE_DIRS = {
    ['|']: ['N', 'S'],
    ['-']: ['E', 'W'],
    ['7']: ['S', 'W'],
    ['J']: ['N', 'W'],
    ['F']: ['S', 'E'],
    ['L']: ['N', 'E'],
    ['S']: ['N', 'E', 'S', 'W'],
};

const DIR_POSSIBLE_PIPES = {
    N: ['|', '7', 'F'],
    E: ['-', '7', 'J'],
    S: ['|', 'J', 'L'],
    W: ['-', 'F', 'L'],
};

const PIPE_BOX_DRAW = {
    ['|']: '│',
    ['-']: '─',
    ['7']: '┐',
    ['J']: '┘',
    ['F']: '┌',
    ['L']: '└',
    ['S']: '┼',
};

const distance = [];
for (let row of data) {
    distance.push(Array(row.length).fill(-1));
}
distance[start.y][start.x] = 0;

let pipeS = '|-7JFL'.split('');

const queue = [start];

while (queue.length) {
    const position = queue.shift();
    const { x, y } = position;

    const currentPipe = data[y][x];
    const currentDistance = distance[y][x];

    for (let direction of PIPE_MOVE_DIRS[currentPipe]) {
        const { dx, dy } = DIR_DELTA[direction];

        const newPosition = { x: position.x + dx, y: position.y + dy };
        const newPipe = data[newPosition.y]?.[newPosition.x];
        if (!newPipe) {
            continue;
        }
        if (!DIR_POSSIBLE_PIPES[direction].includes(newPipe)) {
            continue;
        }

        if (currentPipe === 'S') {
            const possiblePipes = DIR_POSSIBLE_PIPES[DIR_REV[direction]];
            pipeS = pipeS.filter(p => possiblePipes.includes(p));
        }

        const newDistance = distance[newPosition.y][newPosition.x];
        if (newDistance !== -1 /*&& newDistance <= currentDistance + 1*/) {
            continue;
        }

        distance[newPosition.y][newPosition.x] = currentDistance + 1;

        queue.push(newPosition);
    }
}

const max = distance.reduce((max, row) => Math.max(max, Math.max(...row)), -1);
console.log(max);

// function printOverlay() {
//     for (let row of distance) {
//         console.log(row.map(v => (v >= 0 ? '*' : ' ')).join(''));
//         // console.log(row.map(v => (v >= 0 ? `${v}`.padStart(4) : '   .')).join(''));
//     }
// }

// update S pipe
data[start.y][start.x] = pipeS[0];

// clean data
for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
        if (distance[y][x] < 0) {
            data[y][x] = '.';
        }
    }
}

function printData() {
    for (let row of data) {
        console.log(row.map(v => (v !== '.' ? PIPE_BOX_DRAW[v] : ' ')).join(''));
    }
}
// printData();

// hyper neutrino solution :(
let counter = 0;
for (let y = 0; y < data.length; y++) {
    const row = data[y];

    let within = false;
    let up = false;

    for (let x = 0; x < row.length; x++) {
        const pipe = row[x];

        if (pipe === '|') {
            within = !within;
        } else if (pipe === '-') {
            // along the pipe, within doesn't change
        } else if (pipe === 'L' || pipe === 'F') {
            up = pipe === 'L';
        } else if (pipe === '7' || pipe === 'J') {
            if (pipe != (up ? 'J' : '7')) {
                within = !within;
            }
        } else if (pipe === '.') {
            // skip
        } else {
            throw new Error();
        }

        // within and not part of the loop
        if (within && distance[y][x] < 0) {
            counter++;
        }
    }
}
console.log(counter);

console.log('End');
