const fs = require('fs');

module.exports = {
	path : `${__dirname}/../test-result`,
	// nameSpace : 'eagle/test',
	nameSpace : 'agrilab\\fields\\migrations',
	mdText : fs.readFileSync(`${__dirname}/markdown.md`, 'utf8')
};
