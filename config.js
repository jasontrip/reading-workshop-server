exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = 'https://reading-workshop-client.netlify.com/';
exports.DATABASE_URL = process.env.DATABASE_URL ||
											'mongodb://localhost/reading-workshop';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
											'mongodb://localhost/reading-workshop-test';											