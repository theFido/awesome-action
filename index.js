const core = require('@actions/core');
const github = require('@actions/github');

try {
	const name = core.getInput('your-name');
	console.log(`Hello ${name}`);
	const time = (new Date()).toLocaleTimeString();
	core.setOutput('time', time);
	const payload = jSON.stringify(github.context.payload, null, 2);
	console.log(`Payload: ${payload}`);
} catch(err) {
	core.setFailed(err.message);
}