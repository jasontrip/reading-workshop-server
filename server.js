const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

const PORT = process.env.PORT || 8080;

app.use(cors({origin: CLIENT_ORIGIN}));

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

app.listen(PORT, () => console.log(`PORT = ${PORT}`));


module.exports = {app};