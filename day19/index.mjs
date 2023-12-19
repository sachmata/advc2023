import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'example';

console.log(`Day 19 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/19/input

const workflows = new Map();
const parts = [];

for (let line of fromFile(`./day19/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const workflowMatch = /^([a-z]+)\{(.+)\}$/g.exec(line);
    if (workflowMatch) {
        const [, n, s] = workflowMatch;
        const steps = s.split(',');
        workflows.set(n, steps);
        continue;
    }

    const partMatch = /^\{(.+)\}$/g.exec(line);
    if (partMatch) {
        parts.push(
            Object.fromEntries(
                partMatch[1].split(',').map(s => {
                    const [k, v] = s.split('=');
                    return [k, Number(v)];
                })
            )
        );
        continue;
    }
}

const accepted = [];
const rejected = [];

for (let part of parts) {
    const queue = [...workflows.get('in')];
    while (queue.length) {
        const rule = queue.shift();

        if (rule === 'A') {
            accepted.push(part);
            break;
        }
        if (rule === 'R') {
            rejected.push(part);
            break;
        }
        if (rule.includes(':')) {
            const [check, target] = rule.split(':');
            if (eval(`part.${check}`)) {
                queue.splice(0, queue.length, target);
            }
            continue;
        }
        if (workflows.has(rule)) {
            queue.splice(0, queue.length, ...workflows.get(rule));
            continue;
        }
    }
}

const sum = accepted.flatMap(Object.values).reduce((s, v) => s + v);
console.log(sum);

// part 2 hyper neutrino solution
function countAcceptRanges(ranges, name = 'in') {
    if (name === 'R') {
        return 0;
    }
    if (name === 'A') {
        return Object.values(ranges).reduce(
            (acc, [low, high]) => ((acc *= high - low + 1), acc),
            1
        );
    }

    const workflow = workflows.get(name);
    const rules = workflow.slice(0, -1);
    const fallback = workflow.at(-1);

    let total = 0;
    let addFallback = true;

    for (let rule of rules) {
        const [check, target] = rule.split(':');
        const key = check[0];
        const op = check[1];
        const n = Number(check.substring(2));

        const [low, high] = ranges[key];
        const T = op === '<' ? [low, n - 1] : [n + 1, high];
        const F = op === '<' ? [n, high] : [low, n];

        if (T[0] <= T[1]) {
            total += countAcceptRanges({ ...ranges, [key]: T }, target);
        }

        if (F[0] <= F[1]) {
            ranges = { ...ranges, [key]: F };
        } else {
            addFallback = false;
            break;
        }
    }

    if (addFallback) {
        total += countAcceptRanges(ranges, fallback);
    }

    return total;
}

const sum2 = countAcceptRanges({
    x: [1, 4e3],
    m: [1, 4e3],
    a: [1, 4e3],
    s: [1, 4e3],
});
console.log(sum2);

console.log('End');
