import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 8 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/8/input

let instr;
const map = new Map();

for (let line of fromFile(`./day08/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    if (!instr) {
        instr = line.split('');
        continue;
    }

    const [node, branches] = line.split(' = ');
    const [L, R] = branches.substring(1, branches.length - 1).split(', ');
    map.set(node, {
        node,
        L,
        R,
        endsWithA: node.endsWith('A'),
        endsWithZ: node.endsWith('Z'),
    });
}

// console.log(instr);
// console.log(map);

// !!! use example1

let counter = 0;
let cursor = 0;
let current = 'AAA';
while (current !== 'ZZZ') {
    const step = instr[cursor++];
    if (cursor >= instr.length) {
        cursor = 0;
    }

    current = map.get(current)[step];
    counter++;
}

console.log(counter);

// actually simulating all in parallel will be impossible
// it turns out that there is a cycle with same number of steps from node ending in A to Z and back to Z
// we calculate individually the length of each cycle and LCM (Least Common Multiple) of steps will be our final result

const currents = [...map.keys()].filter(n => n.endsWith('A')).map(n => map.get(n));
const counters = [];

for (let ci = 0; ci < currents.length; ci++) {
    counters[ci] = 0;

    let cursor = 0;

    while (true) {
        counters[ci]++;

        const step = instr[cursor++];
        if (cursor >= instr.length) {
            cursor = 0;
        }

        const node = map.get(currents[ci][step]);
        currents[ci] = node;

        if (node.endsWithZ) {
            break;
        }
    }
}

const lcm = (...arr) => {
    const gcd = (x, y) => (!y ? x : gcd(y, x % y));
    const _lcm = (x, y) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
};

const totalSteps = lcm(...counters);
console.log(totalSteps);

console.log('End');
