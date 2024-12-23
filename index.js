const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = 6666;

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/wb', (req, res) => {
	console.log('Received webhook request:', req.body);
	//console.log('req: ', req);


	const commitMessage = req.body.head_commit ? req.body.head_commit.message : null;

	if (commitMessage) {
		console.log('Commit:', commitMessage);
	}

	exec('git config --global --add safe.directory /home/opal/tudeli_back', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	exec('git -C /home/opal/tudeli_back reset --hard', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	console.log('ABOUT TO PULL')

	exec('git -C /home/opal/tudeli_back pull', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
	console.log('RESTARTING SYSTEM')
	exec('sudo systemctl restart django', { cwd: '/home/opal/tudeli_back', shell: '/usr/bin/bash' }, (error, stdout, stderr) => {
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
