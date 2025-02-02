const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = 5555;

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/wb', (req, res) => {
	console.log('Received webhook request:', req.body);
	//console.log('req: ', req);


	const commitMessage = req.body.head_commit ? req.body.head_commit.message : null;

	if (commitMessage) {
		console.log('Commit:', commitMessage);
	}

	exec('git config --global --add safe.directory /var/www/example.org/tudeli', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	exec('git -C /var/www/example.org/tudeli reset --hard', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	console.log('ABOUT TO PULL')

	exec('git -C /var/www/example.org/tudeli pull', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return res.status(500).send('Error executing script');
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});

	setTimeout(() => {

		exec('npm i', { cwd: '/var/www/example.org/tudeli', shell: '/nix/store/4006pcsz94vkxsfv6hqmb36dqd6j6r8x-system-path/bin/bash' }, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return res.status(500).send('Error executing script');
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
		});
	}, 10000)

	setTimeout(() => {

		exec('npm run build', { cwd: '/var/www/example.org/tudeli', shell: '/nix/store/4006pcsz94vkxsfv6hqmb36dqd6j6r8x-system-path/bin/bash' }, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return res.status(500).send('Error executing script');
			}
			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);
			res.status(200).send('Webhook received and script executed!');
		});
	}, 10000)


});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
