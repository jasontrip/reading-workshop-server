const chai = require('chai');
const chaitHttp = require('chai-http');
const mongoose = require('mongoose');
const { User } = require('../models/user.model');
const { runServer, closeServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const {
  describe,
  it,
  before,
  afterEach,
  after,
} = require('mocha');

mongoose.Promise = global.Promise;

chai.should();
const expect = chai.expect;

chai.use(chaitHttp);

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('API', function testAPI() {
  before(() => runServer(TEST_DATABASE_URL));
  after(() => closeServer());

  it('should return 200 on GET from /api', function() {
    return chai.request(app)
      .get('/api/testing')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
});
