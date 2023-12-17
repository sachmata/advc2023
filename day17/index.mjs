import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 17 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/17/input

const grid = [];

for (let line of fromFile(`./day17/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    grid.push(line.split('').map(Number));
}

const DIR = {
    N: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
    E: { x: 1, y: 0 },
};

const DIR_REV = {
    N: 'S',
    S: 'N',
    W: 'E',
    E: 'W',
};

const TARGET_Y = grid.length - 1;
const TARGET_X = grid[0].length - 1;

const MAX_STRAIGHT_STEPS = 10; // 3; // part 1
const MIN_STRAIGHT_STEPS = 4; // 1; // part 1

const queue = [{ x: 0, y: 0, dir: 'X', loss: 0, steps: 0 }];
const visited = new Set();

while (queue.length) {
    queue.sort((a, b) => a.loss - b.loss);
    const tile = queue.shift(); // smallest

    const tileKey = [tile.x, tile.y, tile.dir, tile.steps].join('_');
    if (visited.has(tileKey)) {
        continue;
    }
    visited.add(tileKey);

    if (tile.x === TARGET_X && tile.y === TARGET_Y && tile.steps >= MIN_STRAIGHT_STEPS) {
        console.log('Found', tile.loss);
        break;
    }

    for (let dirKey in DIR) {
        const dir = DIR[dirKey];
        if (dirKey === DIR_REV[tile.dir]) {
            continue; // no back
        }
        if (tile.dir !== 'X' && dirKey !== tile.dir && tile.steps < MIN_STRAIGHT_STEPS) {
            continue; // move straight for min steps
        }
        if (dirKey === tile.dir && tile.steps >= MAX_STRAIGHT_STEPS) {
            continue; // no straight for max steps
        }

        const pos = { x: tile.x + dir.x, y: tile.y + dir.y };
        const loss = grid[pos.y]?.[pos.x];
        if (!loss) {
            continue; // out of grid bounds
        }

        queue.push({
            x: pos.x,
            y: pos.y,
            dir: dirKey,
            loss: tile.loss + loss,
            steps: (dirKey === tile.dir ? tile.steps : 0) + 1,
        });
    }
}

console.log('End');
