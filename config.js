exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://reading-workshop-client.netlify.com'
  : 'http://localhost:3000';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/reading-workshop';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
  'mongodb://localhost/reading-workshop-test';
