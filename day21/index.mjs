import assert from 'node:assert';
import { argv } from 'node:process';

import { fromFile } from '../lib/read-lines.mjs';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 21 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/21/input

const MAP = [];
const START = {};

let lineIndex = 0;
for (let line of fromFile(`./day21/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const row = line.split('');
    MAP.push(row);

    const startIndex = row.indexOf('S');
    if (startIndex !== -1) {
        START.x = startIndex;
        START.y = lineIndex;
    }

    lineIndex++;
}

assert.equal(MAP.length, MAP[0].length, 'Map not square');
const MAP_SIZE = MAP.length;

assert.equal(MAP_SIZE % 2, 1, 'Map size not odd');
assert.equal(START.x, (MAP_SIZE - 1) / 2, 'Start X not in the middle');
assert.equal(START.y, START.x, 'Start Y not in the middle');

const DIR = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
];

function plotDistKey(plot) {
    return [plot.x, plot.y].join('_');
}

function plotSeenKey(plot, distance) {
    return [plot.x, plot.y, distance].join('_');
}

// // infinite map
// function wrap(i, length) {
//     return ((i % length) + length) % length;
// }

function fill(start, maxSteps) {
    const distance = new Map();
    distance.set(plotDistKey(start), 0);

    const maxPlots = new Set();
    const seenPlots = new Set();

    const queue = [start];
    while (queue.length) {
        const plot = queue.shift();
        const dist = distance.get(plotDistKey(plot));
        const dist_ = dist + 1;

        for (let dir of DIR) {
            const plot_ = { x: plot.x + dir.x, y: plot.y + dir.y };

            const mapCode = MAP[plot_.y]?.[plot_.x];
            if (!mapCode || mapCode === '#') {
                continue;
            }

            const seenKey = plotSeenKey(plot_, dist_);
            if (seenPlots.has(seenKey)) {
                continue;
            }
            seenPlots.add(seenKey);

            distance.set(plotDistKey(plot_), dist_);

            if (dist_ >= maxSteps) {
                maxPlots.add(seenKey);
                continue;
            }

            queue.push(plot_);
        }
    }

    return maxPlots.size;
}

// Part 1
console.log(64, fill(START, 64));

// Part 2
// HyperNeutrino madness !!!
const MAX_STEPS = 26501365;
assert.equal(MAX_STEPS % MAP_SIZE, START.x, '!!??');

const MAP_WIDTH = Math.trunc(MAX_STEPS / MAP_SIZE) - 1;
const ODD = (Math.trunc(MAP_WIDTH / 2) * 2 + 1) ** 2;
const EVEN = (Math.trunc((MAP_WIDTH + 1) / 2) * 2) ** 2;

const oddPoints = fill(START, MAP_SIZE * 2 + 1);
const evenPoints = fill(START, MAP_SIZE * 2);

const cornerTop = fill({ x: START.x, y: MAP_SIZE - 1 }, MAP_SIZE - 1);
const cornerRight = fill({ x: 0, y: START.x }, MAP_SIZE - 1);
const cornerBottom = fill({ x: START.x, y: 0 }, MAP_SIZE - 1);
const cornerLeft = fill({ x: MAP_SIZE - 1, y: START.y }, MAP_SIZE - 1);

const smallTopRight = fill({ y: MAP_SIZE - 1, x: 0 }, Math.trunc(MAP_SIZE / 2) - 1);
const smallTopLeft = fill({ y: MAP_SIZE - 1, x: MAP_SIZE - 1 }, Math.trunc(MAP_SIZE / 2) - 1);
const smallBottomRight = fill({ y: 0, x: 0 }, Math.trunc(MAP_SIZE / 2) - 1);
const smallBottomLeft = fill({ y: 0, x: MAP_SIZE - 1 }, Math.trunc(MAP_SIZE / 2) - 1);

const largeTopRight = fill({ y: MAP_SIZE - 1, x: 0 }, Math.trunc((MAP_SIZE * 3) / 2) - 1);
const largeTopLeft = fill({ y: MAP_SIZE - 1, x: MAP_SIZE - 1 }, Math.trunc((MAP_SIZE * 3) / 2) - 1);
const largeBottomRight = fill({ y: 0, x: 0 }, Math.trunc((MAP_SIZE * 3) / 2) - 1);
const largeBottomLeft = fill({ y: 0, x: MAP_SIZE - 1 }, Math.trunc((MAP_SIZE * 3) / 2) - 1);

console.log(
    MAX_STEPS,
    ODD * oddPoints +
        EVEN * evenPoints +
        cornerTop +
        cornerRight +
        cornerBottom +
        cornerLeft +
        (MAP_WIDTH + 1) * (smallTopRight + smallTopLeft + smallBottomRight + smallBottomLeft) +
        MAP_WIDTH * (largeTopRight + largeTopLeft + largeBottomRight + largeBottomLeft)
);

console.log('End');
