import { fromFile } from '../lib/read-lines.mjs';

import { argv } from 'node:process';

const FILE_NAME = argv[2] === '-e' ? 'example' : 'input';

console.log(`Day XX (${FILE_NAME})`);

// https://adventofcode.com/2022/day/XX/input

for (let line of fromFile(`./dayXX/${FILE_NAME}.txt`)) {
    if (!line.length) {
        continue;
    }

    console.log(line);
}

console.log('End');
