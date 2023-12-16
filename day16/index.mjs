import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 16 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/16/input

const DIR = {
    N: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    W: { x: -1, y: 0 },
    E: { x: 1, y: 0 },
};

const grid = [];

for (let line of fromFile(`./day16/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    grid.push(line.split(''));
}

function fireBeam({ p, d }) {
    const visited = new Map();
    const queue = [{ p, d }];

    while (queue.length) {
        const { p: pC, d: dC } = queue.pop();
        const tile = grid[pC.y]?.[pC.x];
        if (!tile) {
            continue;
        }

        const key = [pC.x, pC.y].join('_');
        const list = visited.get(key);
        if (list) {
            if (list.includes(dC)) {
                continue;
            } else {
                list.push(dC);
            }
        } else {
            visited.set(key, [dC]);
        }

        if (
            tile === '.' ||
            (tile === '-' && [DIR.W, DIR.E].includes(dC)) ||
            (tile === '|' && [DIR.N, DIR.S].includes(dC))
        ) {
            const pD = { x: pC.x + dC.x, y: pC.y + dC.y };
            queue.unshift({ p: pD, d: dC });
            continue;
        }

        if (tile === '-' && [DIR.N, DIR.S].includes(dC)) {
            const pE = { x: pC.x + DIR.E.x, y: pC.y + DIR.E.y };
            queue.unshift({ p: pE, d: DIR.E });
            const pW = { x: pC.x + DIR.W.x, y: pC.y + DIR.W.y };
            queue.unshift({ p: pW, d: DIR.W });
            continue;
        }

        if (tile === '|' && [DIR.E, DIR.W].includes(dC)) {
            const pN = { x: pC.x + DIR.N.x, y: pC.y + DIR.N.y };
            queue.unshift({ p: pN, d: DIR.N });
            const pS = { x: pC.x + DIR.S.x, y: pC.y + DIR.S.y };
            queue.unshift({ p: pS, d: DIR.S });
            continue;
        }

        if (tile === '/') {
            let dD;
            switch (dC) {
                case DIR.N:
                    dD = DIR.E;
                    break;
                case DIR.S:
                    dD = DIR.W;
                    break;
                case DIR.E:
                    dD = DIR.N;
                    break;
                case DIR.W:
                    dD = DIR.S;
                    break;
                default:
                    throw new Error();
            }

            const pD = { x: pC.x + dD.x, y: pC.y + dD.y };
            queue.unshift({ p: pD, d: dD });
            continue;
        }

        if (tile === '\\') {
            let dD;
            switch (dC) {
                case DIR.N:
                    dD = DIR.W;
                    break;
                case DIR.S:
                    dD = DIR.E;
                    break;
                case DIR.E:
                    dD = DIR.S;
                    break;
                case DIR.W:
                    dD = DIR.N;
                    break;
                default:
                    throw new Error();
            }

            const pD = { x: pC.x + dD.x, y: pC.y + dD.y };
            queue.unshift({ p: pD, d: dD });
            continue;
        }
    }

    return visited.size;
}

// function printVisited(visited) {
//     for (let y = 0; y < grid.length; y++) {
//         const row = grid[y];
//         const line = [];
//         for (let x = 0; x < row.length; x++) {
//             line.push(visited.has([x, y].join('_')) ? '#' : '.');
//         }
//         console.log(line.join(''));
//     }
// }

// function printGrid(grid) {
//     for (let y = 0; y < grid.length; y++) {
//         const row = grid[y];
//         console.log(row.join(''));
//     }
// }

// part 1
const energized = fireBeam({ p: { x: 0, y: 0 }, d: DIR.E });
console.log(energized);

// part 2
const gridYLength = grid.length;
const gridXLength = grid[0].length;

let maxEnergized = 0;

for (let y = 0; y < gridYLength; y++) {
    const dirEEnergized = fireBeam({ p: { x: 0, y }, d: DIR.E });
    if (maxEnergized < dirEEnergized) {
        maxEnergized = dirEEnergized;
    }

    const dirWEnergized = fireBeam({ p: { x: gridXLength - 1, y }, d: DIR.W });
    if (maxEnergized < dirWEnergized) {
        maxEnergized = dirWEnergized;
    }
}

for (let x = 0; x < gridXLength; x++) {
    const dirSEnergized = fireBeam({ p: { x, y: 0 }, d: DIR.S });
    if (maxEnergized < dirSEnergized) {
        maxEnergized = dirSEnergized;
    }

    const dirNEnergized = fireBeam({ p: { x, y: gridYLength - 1 }, d: DIR.N });
    if (maxEnergized < dirNEnergized) {
        maxEnergized = dirNEnergized;
    }
}

console.log(maxEnergized);

console.log('End');
