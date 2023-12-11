import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 03');

// https://adventofcode.com/2022/day/XX/input

const data = [];

for (let line of fromFile('./day03/input.txt')) {
    if (!line.length) {
        continue;
    }
    // console.log(line);

    data.push(line);
}

const NUMBERS_REGEX = /\d+/g;
const IS_SYMBOL_REGEX = /[^\d\.]/g;
const IS_GEAR_REGEX = /\*/g;
const LEFT_NUMBER_REGEX = /\d+$/g;
const RIGHT_NUMBER_REGEX = /^\d+/g;

// Part one
let sum1 = 0;

for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
    const topLine = data[lineIndex - 1];
    const line = data[lineIndex];
    const bottomLine = data[lineIndex + 1];

    const numbers = [...line.matchAll(NUMBERS_REGEX)];
    for (const match of numbers) {
        const number = match[0];
        const index = match.index;
        const startIndex = Math.max(0, index - 1);
        const endIndex = Math.min(line.length - 1, index + number.length);

        const topMatch = topLine
            ? topLine.substring(startIndex, endIndex + 1).match(IS_SYMBOL_REGEX)
            : null;
        const leftMatch = line[startIndex].match(IS_SYMBOL_REGEX);
        const rightMatch = line[endIndex].match(IS_SYMBOL_REGEX);
        const bottomMatch = bottomLine
            ? bottomLine.substring(startIndex, endIndex + 1).match(IS_SYMBOL_REGEX)
            : null;

        if (topMatch || leftMatch || rightMatch || bottomMatch) {
            sum1 += Number(number);
        }
    }
}

console.log(sum1);

// Part two

let sum2 = 0;

for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
    const topLine = data[lineIndex - 1];
    const line = data[lineIndex];
    const bottomLine = data[lineIndex + 1];

    const gears = [...line.matchAll(IS_GEAR_REGEX)];
    for (const match of gears) {
        const gearIndex = match.index;

        const matchL = line.substring(0, gearIndex).match(LEFT_NUMBER_REGEX);
        const matchR = line.substring(gearIndex + 1).match(RIGHT_NUMBER_REGEX);

        const gearFilter = match => {
            const number = match[0];
            const index = match.index;

            return gearIndex >= index - 1 && gearIndex <= index + number.length;
        };

        const matchTop = [...topLine.matchAll(NUMBERS_REGEX)].filter(gearFilter);
        const matchBottom = [...bottomLine.matchAll(NUMBERS_REGEX)].filter(gearFilter);

        const TL = Number(matchTop?.[0] ?? 0);
        const TR = Number(matchTop?.[1] ?? 0);
        const R = Number(matchR?.[0] ?? 0);
        const L = Number(matchL?.[0] ?? 0);
        const BL = Number(matchBottom?.[0] ?? 0);
        const BR = Number(matchBottom?.[1] ?? 0);

        // possible pairs
        // TL.TR
        // .L*R.
        // BL.BR
        // single T or B is assigned to TL or BL
        const ratio =
            TL * TR ||
            TL * R ||
            TL * BR ||
            TL * BL ||
            TL * L ||
            //
            TR * R ||
            TR * BR ||
            TR * BL ||
            TR * L ||
            //
            R * BR ||
            R * BL ||
            R * L ||
            //
            BR * BL ||
            BR * L ||
            //
            BL * L;

        // if (!ratio) {
        //     console.log('#####', TL, TR, R, BR, BL, L);
        //     console.log(topLine);
        //     console.log(line);
        //     console.log(bottomLine);
        //     console.log('');
        // }

        sum2 += ratio;
    }
}

console.log(sum2);

console.log('End');
