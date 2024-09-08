const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    suite('Validate puzzle string', () => {
        test('Valid 81 characters', () => {
            assert.isTrue(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
        });

        test('Invalid characters', () => {
            assert.isUndefined(solver.validate('A.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
        });

        test('not 81 characters in length', () => {
            assert.isFalse(solver.validate('A..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
        });
    });

    suite('Valid / invalid row / column / region (3 x 3) placement', () => {
        test('Valid row placement', () => {
            assert.isTrue(solver.checkRowPlacement(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'A',
                2,
                3
            ));
        });

        test('Invalid row placement', () => {
            assert.isFalse(solver.checkRowPlacement(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'A',
                2,
                5
            ));
        });

        test('Valid column placement', () => {
            assert.isTrue(solver.checkColPlacement(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'A',
                4,
                7
            ));
        });

        test('Invalid column placement', () => {
            assert.isFalse(solver.checkColPlacement(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'A',
                4,
                3
            ));
        });

        test('Valid region (3 x 3) placement', () => {
            assert.isTrue(solver.checkRegionPlacement(
                '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'I',
                9,
                8
            ));
        });

        test('Invalid region (3 x 3) placement', () => {
            assert.isFalse(solver.checkRegionPlacement(
                'A.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'I',
                9,
                9
            ));
        });
    });

    suite('Solver solves', () => {
        test('Valid puzzle strings pass the solver', () => {
            assert.isNotBoolean(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
        });

        test('Invalid puzzle strings fail the solver', () => {
            assert.isFalse(solver.solve('1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
            assert.isFalse(solver.solve('1...2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
            assert.isFalse(solver.solve('A.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
        });

        test('Solver returns the expected solution for an incomplete puzzle', () => {
            assert.strictEqual(
                solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'),
                '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
            );
        });
    });
});
