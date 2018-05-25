const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {CLIENT_ORIGIN, PORT, DATABASE_URL} = require('./config');

app.use(cors({origin: CLIENT_ORIGIN}));

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

let server;
function runServer(databaseUrl, port = PORT) {
	return mongoose.connect(databaseUrl)
		.then(() => {
			server = app.listen(port, () => console.log(`listening on port ${port}`));
		})
		.catch(err => {
			mongoose.disconnect();
			console.log(err);
			return err;
		});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return server.close();
		})
		.catch(err => {
			console.log(err);
			return err;
		});
}

if (require.main === module) {
	runServer(DATABASE_URL);
}


module.exports = {runServer, app, closeServer};