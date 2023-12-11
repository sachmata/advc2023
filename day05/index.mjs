import { fromFile } from '../lib/read-lines.mjs';

console.log('Day 05');

// https://adventofcode.com/2022/day/05/input

// seeds: 79 14 55 13

const SEED_TO_SOIL_HEADER = 'seed-to-soil';
const SOIL_TO_FERTILIZER_HEADER = 'soil-to-fertilizer';
const FERTILIZER_TO_WATER_HEADER = 'fertilizer-to-water';
const WATER_TO_LIGHT_HEADER = 'water-to-light';
const LIGHT_TO_TEMPERATURE_HEADER = 'light-to-temperature';
const TEMPERATURE_TO_HUMIDITY_HEADER = 'temperature-to-humidity';
const HUMIDITY_TO_LOCATION_HEADER = 'humidity-to-location';

class Mapper {
    constructor(source, destination, length) {
        this.source = source;
        this.destination = destination;
        this.length = length;
    }

    isMapped(value) {
        const delta = value - this.source;
        return delta >= 0 && delta < this.length;
    }

    map(value) {
        const delta = value - this.source;
        return delta >= 0 && delta < this.length ? this.destination + delta : undefined;
    }
}

function mapValue(value, mappers, cache) {
    const mapper = mappers.find(m => m.isMapped(value));
    return mapper?.map(value) ?? value;
}

const seeds = [];

const seed2soil = [];
const soil2fertilizer = [];
const fertilizer2water = [];
const water2light = [];
const light2temperature = [];
const temperature2humidity = [];
const humidity2location = [];

let mappers;

for (let line of fromFile('./day05/input.txt')) {
    if (!line.length) {
        continue;
    }

    // console.log(line);

    if (line.startsWith('seeds')) {
        seeds.push(...line.substring(7).split(' ').map(Number));
        continue;
    }

    if (line.startsWith(SEED_TO_SOIL_HEADER)) {
        mappers = seed2soil;
        continue;
    }
    if (line.startsWith(SOIL_TO_FERTILIZER_HEADER)) {
        mappers = soil2fertilizer;
        continue;
    }
    if (line.startsWith(FERTILIZER_TO_WATER_HEADER)) {
        mappers = fertilizer2water;
        continue;
    }
    if (line.startsWith(WATER_TO_LIGHT_HEADER)) {
        mappers = water2light;
        continue;
    }
    if (line.startsWith(LIGHT_TO_TEMPERATURE_HEADER)) {
        mappers = light2temperature;
        continue;
    }
    if (line.startsWith(TEMPERATURE_TO_HUMIDITY_HEADER)) {
        mappers = temperature2humidity;
        continue;
    }
    if (line.startsWith(HUMIDITY_TO_LOCATION_HEADER)) {
        mappers = humidity2location;
        continue;
    }

    const [destination, source, length] = line.split(' ').map(Number);
    mappers.push(new Mapper(source, destination, length));
}

// console.log(seed2soil);
// console.log(soil2fertilizer);
// console.log(fertilizer2water);
// console.log(water2light);
// console.log(light2temperature);
// console.log(temperature2humidity);
// console.log(humidity2location);

function seed2Location(seed) {
    const soil = mapValue(seed, seed2soil);
    const fertilizer = mapValue(soil, soil2fertilizer);
    const water = mapValue(fertilizer, fertilizer2water);
    const light = mapValue(water, water2light);
    const temperature = mapValue(light, light2temperature);
    const humidity = mapValue(temperature, temperature2humidity);
    const location = mapValue(humidity, humidity2location);

    // console.log({ seed, soil, fertilizer, water, light, temperature, humidity, location });

    return location;
}

let minLocation1 = Number.MAX_SAFE_INTEGER;

for (let seed of seeds) {
    const location = seed2Location(seed);

    if (location < minLocation1) {
        minLocation1 = location;
    }
}

console.log(minLocation1);

let minLocation2 = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < seeds.length; i = i + 2) {
    const seedStart = seeds[i];
    const seedLength = seeds[i + 1];

    console.log('seed range', seedStart, seedLength);

    // brute force
    for (let j = 0; j < seedLength; j++) {
        const seed = seedStart + j;

        const location = seed2Location(seed);

        if (location < minLocation2) {
            minLocation2 = location;

            console.log('current min', minLocation2);
        }
    }
}

console.log(minLocation2);

console.log('End');
