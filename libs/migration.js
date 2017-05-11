const fs = require('fs');
const util = require('utils-igor')(['obj', 'arr', 'type', 'str']);
const doT = require('dot');
const constCodes = {
	pathBad: 1,
	dataNo: 2,
	noPath: 3,
	noNameSpace: 4,
	noStruct: 5,
	noGetTemp: 6,
	noSaveFiles: 7,
	noSaveFile: 8,
	uknow: null
};

doT.templateSettings = {
	evaluate: /\{\{([\s\S]+?)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode: /\{\{!([\s\S]+?)\}\}/g,
	use: /\{\{#([\s\S]+?)\}\}/g,
	define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname: 'it',
	strip: false,
	append: false,
	selfcontained: false
};

/**
 * Get number code by label
 * @method codeGet
 * @param  {string} c
 * @return {integer|null}
 */
const codeGet = c => {
	return {
		code: constCodes[c || 'uknow']
	}
};

/**
 * Check value be string and have length.
 * @method isBeLen
 * @param  {*}  v
 * @return {Boolean}
 */
const isBeLen = v => util.type.isString(v) && v.length;

/**
 * Vilidation data
 * @method validData
 * @param  {*}  data
 * @return {Promise}
 */
const validData = data => new Promise((resolve, reject) => {

	if (util.obj.isEmpty(data))
		return reject('dataNo');

	if (!isBeLen(data.nameSpace) || !data.nameSpace.length)
		return reject('noNameSpace');

	if (!isBeLen(data.path) || !data.path.length)
		return reject('noPath');

	if (!isBeLen(data.struct)) {
		return reject('noStruct');
	}

	resolve();

});

/**
 * Check exist path and premision for him.
 * @method validPath
 * @param  {*}  data
 * @return {Promise}
 */
const validPath = data => new Promise((resolve, reject) => {

	data.path = data.path.trim();

	fs.access(data.path, fs.constants.W_ok, e => {
		if (e) {
			console.error(e);
			return reject('pathBad');
		}

		resolve();
	});
});

/**
 * Check first char in name space.
 * @method validNameSpace
 * @param  {*} data
 * @return {Promise}
 */
const validNameSpace = data => new Promise((resolve, reject) => {
	if (~['\\', '/'].indexOf(data.nameSpace[0]))
		data.nameSpace = data.nameSpace.slice(1);

	resolve();
});

/**
 * Covert string json to json.
 * @method parseJson
 * @param  {object}  data
 * @return {Promise}
 */
const parseJson = data => new Promise((resolve, reject) => {
	try {
		data.struct = JSON.parse(data.struct);
		resolve();
	} catch (e) {
		reject(e);
	}
});

/**
 * Validation data
 * @method validation
 * @param  {*}   data
 * @return {Promise}
 */
const validation = data => new Promise(
	(resolve, reject) => {
		validData(data).then(r => parseJson(data), reject)
			.then(r => validPath(data), reject)
			.then(r => validNameSpace(data), reject)
			.then(r => resolve(data))
			.catch(reject);

	});

/**
 * Create name file and clsss naem
 * @method createClassNames
 * @param  {object} data
 * @return {Promise}
 */
const createClassNames = (data) => new Promise(
	(resolve, reject) => {
		let i = 0;
		data.struct.map((val, inx) => {
			++i;
			let upd = val.table.replace(/__/g, '').trim();
			data.struct[inx].table = upd;
			data.struct[inx].name = 'm' + String(Date.now() + i).slice(1) + upd.split('_').map(val => util.str.up1stChar(val)).join('');

		});

		resolve();
	}
);


let noUsed = {};

/**
 * Add no used fields to noUsed. (For report)
 * @method rowsToReady
 * @param  {object}    data
 * @return {Promise}
 */
const rowsToReady = (data) => new Promise(
	(resolve, reject) => {
		data.struct = data.struct.map(table => {
			table.rows = table.rows.map(row => {
				if (!isBeLen(row.type) || !isBeLen(row.colum)) {
					if (!noUsed[table.table]) {
						noUsed[table.table] = [];
					}
					noUsed[table.table].push(row);
					return false;
				}

				let used = false;

				if (~row.type.indexOf('varchar')) {
					used = true;
					row.type = row.type.replace('varchar', 'string');
				}

				if (~row.type.indexOf('float')) {
					used = true;
					row.type = 'double()';
				}

				if (~row.type.indexOf('multipolygon')) {
					used = true;
					row.type = 'geometry';
				}

				if (~row.type.indexOf('integer')) {
					used = true;
				}

				if (~row.type.indexOf('rast')) {
					used = true;
					row.type = 'raster';
				}

				if (!used) {
					if (!noUsed[table.table]) {
						noUsed[table.table] = [];
					}
					noUsed[table.table].push(row);
					return false;
				}

				return row;
			});

			table.rows = table.rows.filter(row => row);

			return table;
		});

		resolve();
	}
);

/**
 * Save file.
 * @method saveFile
 * @param  {string} path
 * @param  {string} content
 * @return {Promise}
 */
const saveFile = (path, content) => new Promise(
	(resolve, reject) => {
		fs.writeFile(path, content, (e) => {
			if (e) {
				console.error(e);
				return reject('noSaveFile');
			}

			resolve();
		});
	}
);

/**
 * Saved to files
 * @method saveToFiles
 * @param  {Object}    data
 * @return {Promise}
 */
const saveToFiles = (data) => new Promise(
	(resolve, reject) => {
		let filesSaved = [];
		fs.readFile(__dirname + '/../views/temp-first.php', 'utf8', (e, temp) => {
			if (e) {
				console.error(e);
				return reject('noGetTemp');
			}

			let tempFn = doT.template(temp);

			try {

				data.struct.map(val => {

					let content = tempFn({struct: val, ns: data.nameSpace})
						.replace(/(\{\*)+/g, '{{')
						.replace(/(\*\})+/g, '}}')
						.replace(/((\t+)\n(\t+)\n)/g, '\n')
						.replace(/\n\t\t\t\n/g, '\n')
						.replace(/(\n+)/g, '\n');

					filesSaved.push(saveFile(`${data.path}/${val.name}.php`, content));

				});

				Promise.all(filesSaved)
					.then(r => resolve(r), e => reject(e));

			} catch (e) {
				console.error(e);
				return reject('noSaveFiles');
			}

		});
	}
);

/**
 * Create migrations
 * @method create
 * @param  {object} data
 * @return {Promise}
 */
const create = data => new Promise(
	(resolve, reject) => {
		createClassNames(data)
			.then(r => rowsToReady(data), reject)
			.then(r => saveToFiles(data), reject)
			.then(resolve, reject)
			.catch(reject)
	}
);

/**
 * @type {Object}
 */
module.exports = {
	/**
	 * constants errors codes
	 * @type {object}
	 */
	constCodes: constCodes,
	/**
	 * process parse data and create migration files.
	 * @method create
	 * @param  {path: string, nameSpace :string, markdown : string } data [description]
	 * @param  {function} call
	 */
	create: (fromReq, call) => {

		var data = fromReq;

		validation(data)
			.then(data => create(data))
			.then(r => call(null, noUsed))
			.catch(e => {
				let c = e;
				console.log('ERROR', e);
				if (util.type.isObj(e)) {
					c = e.message;
				}

				call(codeGet(c));
			});
	}
};
