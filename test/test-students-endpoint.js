const chai = require('chai');
const chaitHttp = require('chai-http');
const mongoose = require('mongoose');
const { User, Student } = require('../models/user.model');
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

describe('/workshops endpoint', function testWorkshops() {
  describe('POST', function testPost() {
    let testUser;
    let testAuthToken;

    before(() => {
      return runServer(TEST_DATABASE_URL)
        .then(() => {
          const testUser = {
            username: 'testWorkshops',
            password: '12345678910',
            firstName: 'Test',
            lastName: 'McTest'
          };
          return chai.request(app)
            .post('/api/users')
            .send(testUser)
        })
        .then(function(res) {
          testAuthToken = res.body.authToken;
          return User.findOne({username: res.body.user.username});
        })
        .then(function(user) {
          testUser = user;
        });
    });

    afterEach(() => tearDownDb());
    after(() => closeServer());

    it('should add a new student', function() {
      const testStudent = {
        firstName: 'testFirst',
        lastName: 'testLast',
      }

      let newId;

      return chai.request(app)
        .post('/api/students')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testStudent)
      .then(function(res) {
        expect(res).status(201);
        expect(res.body).to.include.keys( '_id', 'firstName', 'lastName');
        newId = res.body._id;
        return User.findOne({ username: testUser.username })
      })
      .then(function(user) {
        const dbStudent = user.students.find(s => {
          return s._id.toString() === newId;
        });
        expect(dbStudent.firstName).to.equal(testStudent.firstName);
        expect(dbStudent.lastName).to.equal(testStudent.lastName);
      });
    });

    it('should deny a request with a missing last name', function() {
      const testStudent = {
        firstName: 'testFirst',
      }

      return chai.request(app)
        .post('/api/students')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testStudent)
      .then(function(res) {
        expect(res).status(422);
      });
    });

    it('should deny a request with a missing firstName', function() {
      const testStudent = {
        lastName: 'testLast',
      }

      return chai.request(app)
        .post('/api/students')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testStudent)
      .then(function(res) {
        expect(res).status(422);
      });
    });

  });
});
