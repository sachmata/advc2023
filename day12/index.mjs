import Cache from '../lib/cache.mjs';
import cyrb53 from '../lib/cyrb53.mjs';
import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 12 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/12/input

const memo = new Cache();

// hyper neutrino solution

function count(springs, groups) {
    const key = cyrb53([springs.join(''), groups.join(',')].join(' '));
    const memoResult = memo.get(key);
    if (memoResult !== undefined) {
        return memoResult;
    }

    if (!springs.length) {
        return !groups.length ? 1 : 0;
    }
    if (!groups.length) {
        return springs.includes('#') ? 0 : 1;
    }

    let result = 0;

    if (['.', '?'].includes(springs[0])) {
        result += count(springs.slice(1), groups);
    }

    if (['#', '?'].includes(springs[0])) {
        if (
            groups[0] <= springs.length &&
            !springs.slice(0, groups[0]).includes('.') &&
            (groups[0] === springs.length || springs[groups[0]] !== '#')
        ) {
            result += count(springs.slice(groups[0] + 1), groups.slice(1));
        }
    }

    memo.set(key, result);
    return result;
}

let sum1 = 0;
let sum2 = 0;

for (let line of fromFile(`./day12/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const [s, g] = line.split(' ');
    const springs = s.split('');
    const groups = g.split(',').map(Number);

    const count1 = count(springs, groups);
    sum1 += count1;

    const springs2 = [
        ...springs,
        '?',
        ...springs,
        '?',
        ...springs,
        '?',
        ...springs,
        '?',
        ...springs,
    ];

    const groups2 = [...groups, ...groups, ...groups, ...groups, ...groups];

    const count2 = count(springs2, groups2);
    sum2 += count2;
}

console.log(sum1);
console.log(sum2);

console.log('End');
