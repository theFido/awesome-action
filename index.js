const core = require('@actions/core');
const github = require('@actions/github');

const MINUTE = 60000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function to(from, factor) {
	return Math.floor(from / factor);
}

try {
	const name = core.getInput('your-name');
	console.log(`Hello ${name}`);
	const time = (new Date()).toLocaleTimeString();
	core.setOutput('time', time);
	const payload = JSON.stringify(github.context.payload, null, 2);
	console.log(`Payload: ${payload}`);
	const commits = Array.isArray(github.context.payload.commits) ? github.context.payload.commits : [];
	let lastDate = null;
	if (commits.length > 0) {
		console.log(`ℹ️  Commits: ${commits.length}`);
		commits.forEach(c => {
			let sinceMsg = '';
			const commitTS = new Date(c.timestamp);
			if (lastDate !== null) {
				const diff = to(commitTS.getTime() - lastDate.getTime(), MINUTE);
				sinceMsg = `${diff.toLocaleString()} minutes after the prev commit`;
			}
			console.log(`- ${c.author.email} ${c.author.name} - ${c.message}. ${sinceMsg}`);
			lastDate = commitTS;
		});
	}
} catch(err) {
	core.setFailed(err.message);
}