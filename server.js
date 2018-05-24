const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

app.listen(PORT, () => console.log(`PORT = ${PORT}`));

module.exports = {app};