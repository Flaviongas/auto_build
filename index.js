const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const zx = require('zx');

const app = express();
const port = 5555;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/wb', async (req, res) => {
	console.log('Received webhook request:', req.body);
	console.log('req: ', req);

	const commitMessage = req.body.head_commit ? req.body.head_commit.message : null;

	if (commitMessage) {
		console.log('Commit:', commitMessage);

		try {
			await $`node /var/www/example.org/auto_build/script.mjs`;
			res.status(200).send('Webhook received and script executed!');
		} catch (error) {
			console.error(`Error executing script: ${error}`);
			res.status(500).send('Error executing script');
		}
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

