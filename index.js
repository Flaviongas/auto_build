const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

//import './script.mjs';

const app = express();
const port = 5555;

app.use(bodyParser.json());

app.post('/wb', (req, res) => {
	console.log('Received webhook request:', req.body);
	if (req.body.head_commit.message) {

		console.log('Commit:', req.body.head_commit.message);
	}

	exec('node script.mjs', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
		res.status(200).send('Webhook received and script executed!');
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

