const chai = require('chai');
const chaitHttp = require('chai-http');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {runServer, closeServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();
chai.use(chaitHttp);

describe('API', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	it('should return 200 on GET from /api', function() {
		return chai.request(app)
			.get('/api/testing')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
			});
	});
});