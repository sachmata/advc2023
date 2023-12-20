import lcm from '../lib/lcm.mjs';
import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';
// const FILE_NAME = 'input';

console.log(`Day 20 (${FILE_NAME})`);

// https://adventofcode.com/2023/day/20/input

let lowCounter = 0;
let highCounter = 0;

function countPulse(signal) {
    if (signal === 'high') {
        highCounter++;
    } else {
        lowCounter++;
    }
}

const processQueue = [];

let pressCounter = 0;

// part 2
const rxFeedInputsCounter = {};

function flipflopReceive(signal, from) {
    // console.log(from, signal, ' -> ', this.name);
    countPulse(signal);

    if (signal !== 'low') {
        return;
    }

    this.state = this.state === 'on' ? 'off' : 'on';
    this.out = this.state === 'on' ? 'high' : 'low';

    processQueue.push(this);
}

function conjunctionReceive(signal, from) {
    // console.log(from, signal, ' -> ', this.name);
    countPulse(signal);

    const inputIndex = this.inputNames.indexOf(from);
    this.inputStates[inputIndex] = signal;
    this.out = this.inputStates.every(s => s === 'high') ? 'low' : 'high';

    processQueue.push(this);

    // part 2
    if (this.name === rxFeed.name && signal === 'high' && !rxFeedInputsCounter[from]) {
        rxFeedInputsCounter[from] = pressCounter;
    }
}

function outputReceive(signal, from) {
    // console.log(from, signal, ' -> ', this.name);
    countPulse(signal);
}

const broadcaster = { name: 'broadcaster', outputs: [] };
const output = { name: 'output', receive: outputReceive, outputNames: [] };

const modules = new Map();

for (let line of fromFile(`./day20/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    const [key, out] = line.split(' -> ');
    const outputNames = out.split(', ');
    if (key === 'broadcaster') {
        broadcaster.outputNames = outputNames;
    } else if (key.startsWith('%')) {
        const name = key.substring(1);
        modules.set(name, {
            type: 'flipflop',
            name,
            outputNames,
            outputs: [],
            state: 'off',
            receive: flipflopReceive,
            out: 'low',
        });
    } else if (key.startsWith('&')) {
        const name = key.substring(1);
        modules.set(name, {
            type: 'conjunction',
            name,
            outputNames,
            outputs: [],
            inputNames: [],
            inputStates: [],
            receive: conjunctionReceive,
            out: 'low',
        });
    }
}

modules.set('output', output);
modules.set('rx', output);

function wireModules() {
    for (let module of [broadcaster, ...modules.values()]) {
        for (let outputName of module.outputNames) {
            const outputModule = modules.get(outputName);

            module.outputs.push(outputModule);

            if (outputModule.type === 'conjunction') {
                outputModule.inputNames.push(module.name);
                outputModule.inputStates.push('low');
            }
        }
    }
}
wireModules();

function pressTheButton() {
    // console.log('button', 'low', ' -> ', 'broadcaster');
    countPulse('low');

    for (let output of broadcaster.outputs) {
        output.receive('low', broadcaster.name);
    }

    while (processQueue.length) {
        const module = processQueue.shift();
        for (let output of module.outputs) {
            output.receive(module.out, module.name);
        }
    }
}

// part 1
// for (let i = 0; i < 1e3; i++) {
//     pressTheButton();
// }
// console.log(highCounter, lowCounter, highCounter * lowCounter);

//part 2
// expect every input of the conjunction module that feeds rx
// to have constant cycle of button presses to turn high
// collect these cycle counts and compute LCM
const rxFeed = [...modules.values()].filter(m => m.outputNames.includes('rx'))[0]; // expect a single module
rxFeed.inputNames.forEach(input => (rxFeedInputsCounter[input] = 0));

while (!Object.values(rxFeedInputsCounter).every(Boolean)) {
    pressCounter++;
    pressTheButton();
}
console.log(rxFeedInputsCounter, lcm(...Object.values(rxFeedInputsCounter)));

console.log('End');
