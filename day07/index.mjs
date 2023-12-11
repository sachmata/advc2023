import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day 07 (${FILE_NAME})`);

// https://adventofcode.com/2022/day/07/input

// 5ofKind, 1 group, 5 max
// 4ofKind, 2 groups, 4 max (4 + 1)
// FullHouse, 2 groups, 3 max (3 + 2)
// 3ofKind, 3 groups, 3 max (3 + 1 + 1)
// 2Pairs, 3 groups, 2 max (2 + 2 + 1)
// 1Pair, 4 groups, 2 max (2 + 1 + 1 + 1)
// HighCard, 5 groups, 1 max (1 + 1 + 1 + 1 + 1)

const CARDS_STRENGTH = 'AKQJT98765432'.split('');
const JOKER_CARDS_STRENGTH = 'AKQT98765432J'.split('');

const hands = [];
const jokerHands = [];

const groupsReducer = (acc, card) => {
    acc.set(card, (acc.get(card) ?? 0) + 1);
    return acc;
};

for (let line of fromFile(`./day07/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    const tokens = line.split(' ');

    const hand = tokens[0].split('');
    const bid = Number(tokens[1]);

    const groups = hand.reduce(groupsReducer, new Map());
    const groupsSize = groups.size;
    const groupsMax = Math.max(...groups.values());

    hands.push({
        bid,

        hand: hand.join(''),

        groups,
        groupsSize,
        groupsMax,
    });

    const sortedCardGroups = [...groups.keys()].sort((a, b) => groups.get(b) - groups.get(a));
    const topCardGroup = sortedCardGroups.filter(c => c !== 'J')[0] ?? 'A';
    const jokerHand = hand.map(c => (c === 'J' ? topCardGroup : c));

    const jokerGroups = jokerHand.reduce(groupsReducer, new Map());
    const jokerGroupsSize = jokerGroups.size;
    const jokerGroupsMax = Math.max(...jokerGroups.values());

    jokerHands.push({
        bid,

        hand: hand.join(''),
        jokerHand: jokerHand.join(''),

        groups: jokerGroups,
        groupsSize: jokerGroupsSize,
        groupsMax: jokerGroupsMax,
    });
}

function handSorter(cardStrength) {
    return (h1, h2) => {
        if (h1.groupsSize !== h2.groupsSize) {
            return h2.groupsSize - h1.groupsSize;
        }

        if (h1.groupsMax !== h2.groupsMax) {
            return h1.groupsMax - h2.groupsMax;
        }

        for (let i = 0; i < h1.hand.length; i++) {
            const h1c = h1.hand[i];
            const h2c = h2.hand[i];

            if (h1c !== h2c) {
                return cardStrength.indexOf(h2c) - cardStrength.indexOf(h1c);
            }
        }

        return 0;
    };
}

const bidReducer = (acc, h, i) => {
    acc += h.bid * (i + 1);
    return acc;
};

const result1 = hands.sort(handSorter(CARDS_STRENGTH)).reduce(bidReducer, 0);
console.log(result1);

const result2 = jokerHands.sort(handSorter(JOKER_CARDS_STRENGTH)).reduce(bidReducer, 0);
console.log(result2);

// console.log(hands);
// console.log(jokerHands);

console.log('End');
