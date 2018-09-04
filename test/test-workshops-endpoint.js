const chai = require('chai');
const chaitHttp = require('chai-http');
const chaiDateTime = require('chai-datetime');
const mongoose = require('mongoose');
const { User, Workshop } = require('../models/user.model');
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
chai.use(chaiDateTime);

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

    it('should add a new workshop', function() {
      const testWorkshop = {
        date: '2018-05-22',
        book: 'testBook',
      }

      let newId;

      return chai.request(app)
        .post('/api/workshops')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testWorkshop)
      .then(function(res) {
        expect(res).status(200);
        expect(res.body).to.include.keys( '_id', 'date', 'book');
        newId = res.body._id;
        return User.findOne({ username: testUser.username })
      })
      .then(function(user) {
        const dbWorkshop = user.workshops.find(w => {
          return w._id.toString() === newId;
        });
        expect(dbWorkshop.book).to.equal(testWorkshop.book);
        expect(dbWorkshop.date).to.equalDate(new Date(testWorkshop.date));
      });
    });

    it('should deny a request with a missing date', function() {
      const testWorkshop = {
        book: 'testBook',
      }

      return chai.request(app)
        .post('/api/workshops')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testWorkshop)
      .then(function(res) {
        expect(res).status(422);
      });
    });

    it('should deny a request with a missing book', function() {
      const testWorkshop = {
        date: '2018-05-22',
      }

      return chai.request(app)
        .post('/api/workshops')
        .set('Authorization', 'Bearer ' + testAuthToken)
        .set('Content-Type', 'application/json')
        .send(testWorkshop)
      .then(function(res) {
        expect(res).status(422);
      });
    });

  });
});
