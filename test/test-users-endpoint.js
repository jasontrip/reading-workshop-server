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

describe('/users endpoint', function testUsers() {
  describe('POST', function testPost() {
    before(() => runServer(TEST_DATABASE_URL));
    afterEach(() => tearDownDb());
    after(() => closeServer());

    it('should add a new user, and not a duplicate', function() {
      const testUser = {
        username: 'testUser',
        password: '12345678910',
        firstName: 'Test',
        lastName: 'McTest'
      };
      return chai.request(app)
        .post('/api/users')
        .send(testUser)
      .then(function(res) {
        expect(res).status(201);
        expect(res).json;
        expect(res.body).include.keys(
          'user', 'authToken')
        return User.findOne({username: res.body.user.username});
      })
      .then(function(user) {
        expect(user.username).to.equal(testUser.username);
        expect(user.firstName).to.equal(testUser.firstName);
        expect(user.lastName).to.equal(testUser.lastName);
        return user.validatePassword(testUser.password);
      })
      .then(function(isValid) {
        expect(isValid).to.be.true;
        return chai.request(app)
          .post('/api/users')
          .send(testUser);
      })
      .then(function(res) {
        expect(res).to.have.status(422);
      });
    });

    it('should deny a request with a missing username', function() {
      const testUser = {
        password: '12345678910',
        firstName: 'Test',
        lastName: 'McTest',
      };

      return chai.request(app)
        .post('/api/users')
        .send(testUser)
        .then(function(res) {
          expect(res).to.have.status(422);
          expect(res.body.username).to.equal('Missing field');
        });
    });

    it('should deny a request with a missing password', function() {
      const testUser = {
        username: 'testUser',
        firstName: 'Test',
        lastName: 'McTest',
      };

      return chai.request(app)
        .post('/api/users')
        .send(testUser)
        .then(function(res) {
          expect(res).to.have.status(422);
          expect(res.body.password).to.equal('Missing field');
        });
    });

    it('should deny a request with a space in the username', function() {
      const testUser = {
        username: 'testUser ',
        password: '12345678910',
        firstName: 'Test',
        lastName: 'McTest'
      };

      return chai.request(app)
        .post('/api/users')
        .send(testUser)
        .then(function(res) {
          expect(res).status(422);
          expect(res).json;
          expect(res.body.username).equal('Cannot start or end with whitespace.');
        });
    });

    it('should deny a request with a space in the password', function() {
      const testUser = {
        username: 'testUser',
        password: '12345678910 ',
        firstName: 'Test',
        lastName: 'McTest'
      }

      return chai.request(app)
        .post('/api/users')
        .send(testUser)
        .then(function(res) {
          expect(res).status(422);
          expect(res).json;
          expect(res.body.password).equal('Cannot start or end with whitespace.');
        });
    });
  });
});
