const core = require('@actions/core');
const github = require('@actions/github');

try {
	const name = core.getInput('your-name');
	console.log(`Hello ${name}`);
	const time = (new Date()).toLocaleTimeString();
	core.setOutput('time', time);
	const payload = JSON.stringify(github.context.payload, null, 2);
	console.log(`Payload: ${payload}`);
	const commits = Array.isArray(github.context.payload.commits) ? github.context.payload.commits : [];
	if (commits.length > 0) {
		console.log(`ℹ️  Commits: ${commits.length}`);
		commits.forEach(c => {
			console.log(`- ${c.author.email} ${c.author.name} - ${c.message}`);
		});
	}
} catch(err) {
	core.setFailed(err.message);
}