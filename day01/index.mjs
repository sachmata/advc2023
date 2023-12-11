import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 1 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/1/input

let sum = 0;

const spelled = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

for (let line of fromFile(`./day01/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    const tokens = line.split('');

    let digits = [];
    let acc = '';

    tokens.forEach(t => {
        let digit = Number(t);
        if (!Number.isNaN(digit)) {
            digits.push(`${digit}`);
            acc = '';
        } else {
            acc += t;
            spelled.some((s, i) => {
                if (acc.endsWith(s)) {
                    digits.push(`${i + 1}`);
                    // acc = ''; // overlapping digits are still valid
                    return true;
                }
                return false;
            });
        }
    });

    const number = Number(digits.at(0) + digits.at(-1));

    // console.log(digits);
    // console.log(number);

    sum += number;
}

console.log(sum);

console.log('End');
