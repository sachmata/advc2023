import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 18 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/18/input

const DIR = {
    R: { x: 1, y: 0 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    U: { x: 0, y: -1 },
};
const DIRS = Object.keys(DIR); // part 2 order!

let b = 0;
const points = [{ x: 0, y: 0 }];

for (let line of fromFile(`./day18/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // const matches = /^([RDLU])\s(\d+)\s\(#([0-9a-f]{6})\)$/g.exec(line); // part 1
    const matches = /^([RDLU])\s(\d+)\s\(#([0-9a-f]{5})([0-3])\)$/g.exec(line);
    if (!matches) {
        continue;
    }

    const _point = points.at(-1);

    // part 1
    // const dir = matches[1];
    // const steps = Number(matches[2]);
    // const color = matches[3];
    // b += steps;
    // points.push({ x: _point.x + DIR[dir].x * steps, y: _point.y + DIR[dir].y * steps });

    // part 2
    const steps2 = Number.parseInt(matches[3], 16);
    const dir2 = DIRS[Number(matches[4])];
    b += steps2;
    points.push({ x: _point.x + DIR[dir2].x * steps2, y: _point.y + DIR[dir2].y * steps2 });
}

// https://en.wikipedia.org/wiki/Shoelace_formula#Other_formulas
const A =
    Math.abs(
        points.reduce((acc, p, i, ps) => {
            const _i = i - 1;
            const i_ = (i + 1) % ps.length;
            acc += p.y * (ps.at(_i).x - ps.at(i_).x);
            return acc;
        }, 0)
    ) / 2;

// https://en.wikipedia.org/wiki/Pick%27s_theorem
const i = A - b / 2 + 1;

const S = i + b;

console.log(S);

console.log('End');
