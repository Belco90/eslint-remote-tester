import fs from 'fs';

import {
    compareResults,
    prepareResultsDirectory,
    writeComparisonResults,
    RESULTS_LOCATION,
    RESULTS_COMPARE_DIR,
    RESULTS_COMPARISON_CACHE_LOCATION,
} from '@file-client';
import {
    Result,
    RESULT_PARSER_TO_COMPARE_TEMPLATE,
} from '@file-client/result-templates';
import { mockConfig } from '__mocks__/@config';
import { getComparisonResults } from '../utils';

jest.unmock('@file-client');

const MOCK_RESULT_FILES = ['mock-result-one.md', 'mock-result-two.md'];
const MOCK_COMPARISON_FILES = ['added.md', 'removed.md'];

const createResultsDirectory = () => fs.mkdirSync(RESULTS_LOCATION);
const readResultsDirectory = () => fs.readdirSync(RESULTS_LOCATION);
const resultsDirectoryExists = () => fs.existsSync(RESULTS_LOCATION);
const comparisonCacheExists = () =>
    fs.existsSync(RESULTS_COMPARISON_CACHE_LOCATION);
const createComparisonDirectory = () =>
    fs.mkdirSync(`${RESULTS_LOCATION}/${RESULTS_COMPARE_DIR}`);
const readComparisonDirectory = () =>
    fs.readdirSync(`${RESULTS_LOCATION}/${RESULTS_COMPARE_DIR}`);
const readComparisonCache = () =>
    JSON.parse(fs.readFileSync(RESULTS_COMPARISON_CACHE_LOCATION, 'utf8'));

function removeResultsDirectory(): void {
    if (resultsDirectoryExists()) {
        fs.rmdirSync(RESULTS_LOCATION, { recursive: true });
    }
}

function createResults(): void {
    removeResultsDirectory();
    createResultsDirectory();

    MOCK_RESULT_FILES.forEach(name =>
        fs.writeFileSync(`${RESULTS_LOCATION}/${name}`, 'Hello world', 'utf8')
    );
}

function createComparisonCache(...results: Result[]): void {
    removeComparisonCache();

    fs.writeFileSync(
        RESULTS_COMPARISON_CACHE_LOCATION,
        JSON.stringify(results),
        'utf8'
    );
}

function removeComparisonCache(): void {
    if (comparisonCacheExists()) {
        fs.unlinkSync(RESULTS_COMPARISON_CACHE_LOCATION);
    }
}

function generateResult(prefix = '0'): Result {
    return {
        repository: `${prefix}-repository`,
        repositoryOwner: `${prefix}-repositoryOwner`,
        rule: `${prefix}-rule`,
        message: `${prefix}-message`,
        path: `${prefix}-path`,
        link: `${prefix}-link`,
        extension: `${prefix}-extension`,
        source: `${prefix}-source`,
        error: `${prefix}-error`,
        __internalHash: `${prefix}-__internalHash` as Result['__internalHash'],
    };
}

function createComparisonResults(): void {
    removeResultsDirectory();
    createResultsDirectory();
    createComparisonDirectory();

    MOCK_COMPARISON_FILES.forEach(name =>
        fs.writeFileSync(
            `${RESULTS_LOCATION}/${RESULTS_COMPARE_DIR}/${name}`,
            'Hello world',
            'utf8'
        )
    );
}

describe('file-client', () => {
    describe('prepareResultsDirectory', () => {
        afterEach(() => {
            removeResultsDirectory();
        });

        test('creates results directory when previous does not exist', () => {
            removeResultsDirectory();

            prepareResultsDirectory();

            expect(resultsDirectoryExists()).toBe(true);
        });

        test('empties results directory when previous exists', () => {
            createResults();
            const filesBefore = readResultsDirectory();

            prepareResultsDirectory();
            const filesAfter = readResultsDirectory();

            expect(filesAfter).not.toHaveLength(filesBefore.length);
            // Only comparison directory should exist
            expect(readResultsDirectory()).toHaveLength(1);
        });

        test('creates empty comparison directory when previous does not exist', () => {
            removeResultsDirectory();

            prepareResultsDirectory();

            expect(readResultsDirectory()).toEqual([RESULTS_COMPARE_DIR]);
        });

        test('empties comparison directory when previous exists', () => {
            createComparisonResults();

            prepareResultsDirectory();

            expect(readComparisonDirectory()).toHaveLength(0);
        });

        test.todo('does not remove results if called from worker thread');
    });

    describe('compareResults', () => {
        test('marks new results as "added"', () => {
            const one = generateResult('1');
            const two = generateResult('2');
            const three = generateResult('3');
            createComparisonCache(three);

            const results = compareResults([one, two, three]);

            expect(results.added).toEqual([one, two]);
            expect(results.removed).toHaveLength(0);
        });

        test('marks disappeared results as "removed"', () => {
            const one = generateResult('1');
            const two = generateResult('2');
            const three = generateResult('3');
            createComparisonCache(one, two, three);

            const results = compareResults([three]);

            expect(results.removed).toEqual([one, two]);
            expect(results.added).toHaveLength(0);
        });

        test('identifies changes in result.__internalHash', () => {
            const result = generateResult();
            createComparisonCache({ ...result, __internalHash: '1' as any });

            const results = compareResults([
                { ...result, __internalHash: '2' as any },
            ]);

            expect(results.added).toEqual([{ ...result, __internalHash: '2' }]);
        });

        test('marks all results as "added" when previous results are not found', () => {
            removeComparisonCache();

            const one = generateResult('1');
            const two = generateResult('2');
            const results = compareResults([one, two]);

            expect(results.added).toEqual([one, two]);
            expect(results.removed).toHaveLength(0);
        });
    });

    describe('writeComparisonResults', () => {
        test('writes comparison results to file system', () => {
            const template = RESULT_PARSER_TO_COMPARE_TEMPLATE.markdown;

            const results = [generateResult('1'), generateResult('2')];
            const comparisonResults = {
                added: [generateResult('3')],
                removed: [generateResult('4')],
            };

            writeComparisonResults(comparisonResults, results);
            const { added, removed } = getComparisonResults();

            expect(added).toBe(template('added', comparisonResults.added));
            expect(removed).toBe(
                template('removed', comparisonResults.removed)
            );
        });

        test('updates comparison cache on file system when updateComparisonReference is enabled', () => {
            mockConfig.mockReturnValue({ updateComparisonReference: true });
            removeComparisonCache();
            const results = [generateResult('1'), generateResult('2')];

            writeComparisonResults({ added: [], removed: [] }, results);

            expect(comparisonCacheExists()).toBe(true);
            expect(readComparisonCache()).toEqual(results);
        });

        test('does not update comparison cache when updateComparisonReference is disabled', () => {
            mockConfig.mockReturnValue({ updateComparisonReference: false });
            removeComparisonCache();
            const results = [generateResult('1'), generateResult('2')];

            writeComparisonResults({ added: [], removed: [] }, results);

            expect(comparisonCacheExists()).toBe(false);
        });

        test('does not crash if results compare location is not found', () => {
            removeResultsDirectory();

            writeComparisonResults({ added: [], removed: [] }, [
                generateResult(),
            ]);
        });
    });
});
