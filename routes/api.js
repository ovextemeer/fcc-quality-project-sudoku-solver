'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (
        !req.body.hasOwnProperty('puzzle')
        ||
        !req.body.hasOwnProperty('coordinate')
        ||
        !req.body.hasOwnProperty('value')
      ) {
        res.json({ error: 'Required field(s) missing' });
      }

      if (req.body.puzzle.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (solver.validate(req.body.puzzle) === undefined) {
        res.json({ error: 'Invalid characters in puzzle' });
      }

      const r = req.body.coordinate.charAt(0);
      const c = req.body.coordinate.slice(1);

      if (r < 'A' || r > 'I' || Number(c) < 1 || Number(c) > 9) {
        res.json({ error: 'Invalid coordinate' });
      }

      if (isNaN(Number(req.body.value)) || Number(req.body.value) < 1 || Number(req.body.value) > 9) {
        res.json({ error: 'Invalid value' });
      }

      let conflicts = [];

      if (!solver.checkRowPlacement(req.body.puzzle, r, c, req.body.value)) {
        conflicts.push('row');
      }

      if (!solver.checkColPlacement(req.body.puzzle, r, c, req.body.value)) {
        conflicts.push('column');
      }

      if (!solver.checkRegionPlacement(req.body.puzzle, r, c, req.body.value)) {
        conflicts.push('region');
      }

      if (conflicts.length === 0) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('puzzle')) {
        res.json({ error: 'Required field missing' });
      }

      if (solver.validate(req.body.puzzle) === undefined) {
        res.json({ error: 'Invalid characters in puzzle' });
      }

      if (!solver.validate(req.body.puzzle)) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      const solved = solver.solve(req.body.puzzle);

      if (solved === false) {
        res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solved });
    });
};
