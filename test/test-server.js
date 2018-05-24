const chai = require('chai');
const chaitHttp = require('chai-http');

const {app} = require('../server');

const should = chai.should();
chai.use(chaitHttp);

describe('API', function() {

	it('should return 200 on GET from /api', function() {
		return chai.request(app)
			.get('/api/testing')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
			});
	});
});