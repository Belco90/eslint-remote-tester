import validator from './validator';
import { Config } from './types';

const DEFAULT_CONFIGURATION: Config = {
    repositories: ['test-repo'],
    extensions: ['.ts', '.tsx'],
    pathIgnorePattern: undefined,
    rulesUnderTesting: [],
    resultParser: undefined,
    concurrentTasks: undefined,
    eslintrc: {},
    CI: undefined,
};

describe('Config validator', () => {
    test('repositories are required', () => {
        expect(() =>
            validator({ ...DEFAULT_CONFIGURATION, repositories: null })
        ).toThrowError('Configuration validation errors: Missing repositories');
    });
});