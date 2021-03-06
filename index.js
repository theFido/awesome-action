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
	const commits = Array.isArray(github.context.payload.commits) ? github.context.payload.commits : [];
	let lastDate = null;
	let firstCommit = null;
	if (commits.length > 0) {
		console.log(`ℹ️  Commits: ${commits.length}`);
		commits.forEach(c => {
			let sinceMsg = '';
			const commitTS = new Date(c.timestamp);
			if (lastDate !== null) {
				const diff = to(commitTS.getTime() - lastDate.getTime(), MINUTE);
				sinceMsg = `\u001b[33m${diff.toLocaleString()} minutes after the prev commit\u001b[0m`;
			} else {
				firstCommit = commitTS;
			}
			console.log(`- [${c.author.email} ${c.author.name}] - "${c.message}". ${sinceMsg}`);
			lastDate = commitTS;
		});
		if (commits.length > 2) {
			const diff = to(lastDate.getTime() - firstCommit.getTime(), MINUTE);
			const msg = `${diff.toLocaleString()} minutes`;
			console.log(`\n⏰ Buidling this feature took about: ${msg}`);
			core.setOutput('time', msg);
		} else {
			core.setOutput('time', 'unknown');
		}
	}
} catch(err) {
	core.setFailed(err.message);
}