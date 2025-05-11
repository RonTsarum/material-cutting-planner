// @ts-nocheck
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    roots: ['<rootDir>/src'],
};
