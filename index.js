import express from 'express';  // Use `import` instead of `require`
import { exec } from 'child_process';  // Destructuring import from `child_process`
import bodyParser from 'body-parser';  // Import bodyParser as default

import chalk from 'chalk';

const app = express();
const port = 6666;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/wb', (req, res) => {
	console.log(chalk.blue('Received webhook request:', req.body));

	const commitMessage = req.body.head_commit ? req.body.head_commit.message : null;

	if (commitMessage) {
		console.log(chalk.green('Commit:', commitMessage));  // Green for commit message
	}

	exec('git config --global --add safe.directory /home/opal/tudeli_back', (error, stdout, stderr) => {
		if (error) {
			console.error(chalk.red(`exec error: ${error}`));  // Red for errors
			return res.status(500).send('Error executing script');
		}
		console.log(chalk.cyan(`stdout: ${stdout}`));  // Cyan for stdout
		console.error(chalk.yellow(`stderr: ${stderr}`));  // Yellow for stderr
	});

	exec('git -C /home/opal/tudeli_back reset --hard', (error, stdout, stderr) => {
		if (error) {
			console.error(chalk.red(`exec error: ${error}`));
			return res.status(500).send('Error executing script');
		}
		console.log(chalk.cyan(`stdout: ${stdout}`));
		console.error(chalk.yellow(`stderr: ${stderr}`));
	});

	console.log(chalk.magenta('ABOUT TO PULL'));  // Magenta for this stage

	exec('git -C /home/opal/tudeli_back pull', (error, stdout, stderr) => {
		if (error) {
			console.error(chalk.red(`exec error: ${error}`));
			return res.status(500).send('Error executing script');
		}
		console.log(chalk.cyan(`stdout: ${stdout}`));
		console.error(chalk.yellow(`stderr: ${stderr}`));
	});

	console.log(chalk.magenta('RESTARTING SYSTEM'));  // Magenta for restart stage
	exec('sudo systemctl restart django', { cwd: '/home/opal/tudeli_back', shell: '/usr/bin/bash' }, (error, stdout, stderr) => {
		if (error) {
			console.error(chalk.red(`exec error: ${error}`));
			return res.status(500).send('Error executing script');
		}
		console.log(chalk.cyan(`stdout: ${stdout}`));
		console.error(chalk.yellow(`stderr: ${stderr}`));
		res.status(200).send('Webhook received and script executed!');
	});
});

app.listen(port, () => {
	console.log(chalk.green(`Server is running on port ${port}`));  // Green for the server start message
});

