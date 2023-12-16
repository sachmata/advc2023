import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 15 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/15/input

let sequence;

for (let line of fromFile(`./day15/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    sequence = line.split(',');
}

function hash(input) {
    let current = 0;
    for (let i = 0; i < input.length; i++) {
        current = current + input.charCodeAt(i);
        current = current * 17;
        current = current % 256;
    }
    return current;
}

// console.log(hash('HASH'));

// part 1
const sum1 = sequence.reduce((acc, instr) => ((acc += hash(instr)), acc), 0);
console.log(sum1);

// part 2
const boxes = Array.from({ length: 256 }, () => []);

for (let instr of sequence) {
    const [removeLabel, empty] = instr.split('-');
    if (empty === '') {
        const box = boxes[hash(removeLabel)];
        const index = box.findIndex(({ l }) => l === removeLabel);
        if (index !== -1) {
            box.splice(index, 1);
        }

        continue;
    }

    const [addLabel, power] = instr.split('=');
    if (power) {
        const box = boxes[hash(addLabel)];
        const lens = box.find(({ l }) => l === addLabel);
        if (lens) {
            lens.p = Number(power);
        } else {
            box.push({ l: addLabel, p: Number(power) });
        }

        continue;
    }
}

const sum2 = boxes.reduce((acc, box, boxIndex) => {
    acc += box.reduce((acc, { p }, lensIndex) => {
        acc += (boxIndex + 1) * (lensIndex + 1) * p;
        return acc;
    }, 0);
    return acc;
}, 0);
console.log(sum2);

console.log('End');
