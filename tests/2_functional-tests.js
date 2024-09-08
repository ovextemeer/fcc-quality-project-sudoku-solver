const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST request to /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.solution,
                        '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
                    );
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({})
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Required field missing'
                    );
                    done();
                });
        });

        test('Solve a puzzle with invalid characters', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: 'A2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Invalid characters in puzzle'
                    );
                    done();
                });
        });

        test('Solve a puzzle with incorrect length', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: '82.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Expected puzzle to be 81 characters long'
                    );
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: '82..2..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Puzzle cannot be solved'
                    );
                    done();
                });
        });
    });

    suite('POST request to /api/check', () => {
        test('Check a puzzle placement with all fields', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A3',
                    value: 7
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.property(res.body, 'valid');
                    assert.isBoolean(res.body.valid);
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A3',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.strictEqual(res.body.conflict.length, 1);
                    assert.strictEqual(res.body.conflict[0], 'row');
                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A3',
                    value: 1
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.strictEqual(res.body.conflict.length, 2);
                    assert.isTrue(res.body.conflict.includes('column'));
                    assert.isTrue(res.body.conflict.includes('region'));
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A4',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.strictEqual(res.body.conflict.length, 3);
                    assert.isTrue(res.body.conflict.includes('row'));
                    assert.isTrue(res.body.conflict.includes('column'));
                    assert.isTrue(res.body.conflict.includes('region'));
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    coordinate: 'A4',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Required field(s) missing'
                    );
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: 'A2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A4',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Invalid characters in puzzle'
                    );
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A4',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Expected puzzle to be 81 characters long'
                    );
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'C0',
                    value: 6
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Invalid coordinate'
                    );
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
                    coordinate: 'A3',
                    value: 12
                })
                .end((req, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.type, 'application/json');
                    assert.strictEqual(
                        res.body.error,
                        'Invalid value'
                    );
                    done();
                });
        });
    });
});

