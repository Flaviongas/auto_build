const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = 5555;

app.use(bodyParser.json());

app.post('/wb', (req, res) => {

	console.log('Received webhook request:', req.body);

	res.status(200).send('Webhook received!');

});

app.listen(port, () => {

	console.log(`Server is running on port ${port}`);

});
