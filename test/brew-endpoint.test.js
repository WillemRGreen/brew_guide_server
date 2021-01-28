const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Brews Endpoints', function() {
    let db

    const {
        testUsers,
        testBrews,
    } = helpers.makeAllItems()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from database', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/brews`, () => {
        
        context(`Given no brews`, () => {
            beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers
                )
            )
            it('responds with 200 and empty list', () => {
                return supertest(app)
                .get('/api/brews')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
            })
        })
        context('Given brews are present', () => {
            beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers,
                    testBrews
                )
            )
            it('responds with an array of objects', () => {
                return supertest(app)
                .get('/api/brews')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('array');
                    res.body.forEach((item) => {
                        expect(item).to.be.a('object')
                        expect(item).to.include.keys(
                            'id',
                            'name',
                            'description',
                            'input',
                            'output',
                            'method',
                            'roast_level',
                            'grind'
                        )
                    })
                })
            })
        })
    })

    describe('POST /api/brews', () => {
        beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers,
                )
            )
        it('should create and return brew', () => {
            const newBrew = {
                name: 'test brew',
                description: 'test description for posting a brew',
                output: '596',
                method: 'kalita',
                roast_level: 'medium'
            }

            return supertest(app)
            .post('/api/brews')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newBrew)
            .expect(201)
            .expect(res => {
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'id',
                    'name',
                    'description',
                    'input',
                    'output',
                    'method',
                    'roast_level',
                    'grind'
                )
                expect(res.body.name).to.equal(newBrew.name)
                expect(res.body.description).to.equal(newBrew.description);
            })
        })
    })

    describe('PATCH /api/brews/:id', () => {

        beforeEach('seed items', () => 
            helpers.seedTables(
                db,
                testUsers,
                testBrews
            )
        )

        it('should patch brew when given existing id', () => {
            const updateFields = {
                name: 'new brew name'
            }

            let brew;
            return db('brew_brews')
            .first()
            .then(item => {
                brew = item
                return supertest(app)
                .patch(`/api/brews/${brew.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updateFields)
                .expect(204)
            })
        })
    })

    describe('DELETE /api/brews/:id', () => {

        beforeEach('seed items', () => 
            helpers.seedTables(
                db,
                testUsers,
                testBrews
            )
        )

        it('should delete an item by id', () => {
            let brew;
            return db('brew_brews')
              .first()
              .then(item => {
                  brew = item;
                return supertest(app)
                  .delete(`/api/brews/${brew.id}`)
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                  .expect(204);
              })
          });
    })
})