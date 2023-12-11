import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 4 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/4/input

let sum = 0;
let cardIndex = 0;
const cards = [];

for (let line of fromFile(`./day04/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    const [winSet, playSet] = line
        .substring(7)
        .split('|')
        .map(n => {
            return new Set(
                n
                    .trim()
                    .split(' ')
                    .filter(d => !!d.trim())
                    .map(Number)
            );
        });

    const match = [...playSet.values()].reduce((acc, n) => {
        return acc + (winSet.has(n) ? 1 : 0);
    }, 0);

    cards.push({ card: cardIndex++, winSet, playSet, match });

    const win = match ? Math.pow(2, match - 1) : 0;
    sum += win;
}

console.log(sum);

let processedCards = 0;
function processCard(cardIndex) {
    const card = cards[cardIndex];

    for (let i = cardIndex + 1; i <= cardIndex + card.match; i++) {
        processCard(i);
    }

    processedCards++;
}

for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    processCard(cardIndex);
}

console.log(processedCards);

console.log('End');
