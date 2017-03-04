/**
 * Created by igor on 30.05.16.
 * @module obj
 * @description Function for object
 */

/**
 * Return object keys
 * @param {Object} obj
 */
const keys = obj => Object.keys(obj);

/**
 * Check v be no undefined or null
 * @param {*}v
 */
let isSet = (v) => typeof v !== 'undefined' && v !== null;

/**
 * Check is object
 * @param {Object}obj
 * @returns {boolean}
 */
const isObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

const n = () => {};
/**
 * ForEach for Object fn(key, val) and sort keys by fnSort
 * @param {Object}obj
 * @param {Function}fn
 * @param {Function}fnSort
 */
const each = (obj, fn, fnSort) => {

	if (!isObj(obj))
		return;

	fn = typeof fn !== 'function' ? n : fn;

	let k = keys(obj);

	if (fnSort) {
		k = k.sort(fnSort);
	}

	for (let i = 0, len = k.length; i < len; ++i)
		fn(k[i], obj[k[i]]);
};

/**
 * Return object. When keys is specified property, value is object from array objects
 * @param {Array}arr
 * @param {String}prop
 * @param {Function}fnIterProp
 * @returns {{}}
 */
const arrToObjByKey = (arr, prop, fnIterProp) => {
	var obj = {};

	if (!Array.isArray(arr) || !prop)
		return obj;

	for (let i = 0; i < arr.length; ++i) {
		let el = arr[i];

		if (el[prop]) {
			let key = el[prop];

			if (typeof fnIterProp === 'function')
				key = fnIterProp(key, el);

			obj[key] = el;
		}
	}

	return obj;
};

/**
 * Get properties from obj by keys
 * @param {object} obj
 * @param {*} ks [{keyOld : keyNew,...}]
 * @returns {{}}
 */
const keysChange = (obj, ks) => {
	let r = {},
		arKey,
		isNewkey = false;

	if (isObj(ks)) {
		arKey = keys(ks);
		isNewkey = true;
	} else
		arKey = ks;


	if (obj && Array.isArray(arKey)) {
		for (let i = 0; i < arKey.length; ++i) {
			let k = arKey[i];

			if (obj[k] || obj[k] === false)
				r[isNewkey ? ks[k] : k] = obj[k];

		}
	}

	return r;
};

/**
 * Return new object when keys be sort
 * @param {Object}obj
 * @param {Boolean}down
 * @returns {{}}
 */
const sort = (obj, down) => {
	down = down || false;

	let r = {},
		k = keys(obj).sort();

	if (down)
		k.reverse();


	for (let i = 0; i < keys.length; i++)
		r[k[i]] = obj[k[i]];

	return r;

};

/**
 * Increment object property to the specified value
 * @param {Object} obj
 * @param {String} prop
 * @param {Number} byVal
 * */
const propInc = (obj, prop, byVal) => {
	let val = byVal || 1;

	val = isNaN(val) ? 1 : Number(val);

	if (!isObj(obj))
		return obj;

	if (obj[prop] === undefined)
		obj[prop] = val;
	else {

		if (isNaN(obj[prop]))
			return obj;
		else
			obj[prop] = Number(obj[prop]);

		obj[prop] += val;
	}

	return obj;
};

/**
 * Check is set object. If not, it creates it with the specified value
 * @param {Object} ob
 * @param {String} prop
 * @param {Object} def
 */
const beInObj = (ob, prop, def) => {
	if (def === undefined) def = {};

	if (ob && !ob[prop]) ob[prop] = def;

	return ob;
};

/**
 * Create path in object
 * @param {Object|Array|String}obj
 * @param {Array|String|null|undefined}path
 * @param {*}def
 */
const pathCreate = function (obj, path, def) {

	if (!isSet(path)) {
		//noinspection JSValidateTypes
		path = obj;
		obj = {};
	}

	if (typeof path === 'string')
		path = path.split('.');

	let b = obj;
	let len = path.length;

	if (len === 1) { //noinspection JSCheckFunctionSignatures
		beInObj(b, path[0]);
	} else if (len > 1) {

		len--;

		for (let i = 0; i < len; i++) {
			//noinspection JSCheckFunctionSignatures
			beInObj(b, path[i]);
			b = b[path[i]];
		}

		beInObj(b, path[len], def);
	}

	return obj;
};

/**
 * Check exist path in object
 * @param {Object}obj
 * @param {*} path
 * @returns {Boolean}
 */
const isPathExist = (obj, path) => {
	let arPath = [];

	if (typeof path === 'string')
		arPath = path.split('.');
	else if (Array.isArray(path))
		arPath = path;


	if (!arPath.length) return true;
	let p = arPath.shift();
	return obj.hasOwnProperty(p) || obj[p] !== undefined ? isPathExist(obj[p], arPath) : false;
};

/**
 * Get element by path in object
 * @param {Object}obj
 * @param {String}path
 * @returns {*}
 */
const pathVal = (obj, path) => {

	if (!isSet(obj) || !isObj(obj))
		return undefined;

	let r = obj;

	if (typeof path === 'string') { //noinspection JSValidateTypes
		path = path.split('.');
	}

	for (let i = 0; i < path.length; ++i) {

		let next = path[i];

		if (r[next])
			r = r[next];
		else
			return undefined;
	}

	return r;
};

/**
 * Serialize object to url params
 * @param {Object} obj
 * @returns {string}
 */
const urlParams = (obj) => {
	let arr = [];

	//noinspection JSCheckFunctionSignatures
	each(obj, (key, val) => arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val)));

	return arr.join('&');
};

/**
 * Properties in add object adding to obj or if properties not exits create him
 * @param {Object}obj
 * @param {Object}add
 * @returns {*}
 */
const ext = (obj, add) => {
	let j = (obj, op) => {
		//noinspection JSCheckFunctionSignatures
		each(op, (k, val) => {
			if (isObj(val))
				if (!obj[k])
					obj[k] = val;
			else
					j(obj[k], val);

			else
				obj[k] = val;

		});
	};

	obj = obj || {};

	if (add)
		j(obj, add);

	return obj;
};

/**
 * Get property from array objects
 * @param {Array}arObj
 * @param {String}prop
 * @returns {Array}
 */
const getPropToArr = (arObj, prop) => {

	let r = [];

	if (!Array.isArray(arObj)) arObj = [arObj];

	for (let i = 0; i < arObj.length; ++i)
		if (isSet(arObj[i][prop]))
			r.push(arObj[i][prop]);

	return r;
};

/**
 * Collect object property to array
 * @param {Object}obj
 * @returns {Array}
 */
const propToArr = (obj) => {
	let arr = [];

	if (!isObj(obj))
		return arr;

	//noinspection JSCheckFunctionSignatures
	each(obj, (key) => arr.push(obj[key]));

	return arr;
};

/**
 * if o is object return true else false
 * @param {Object}obj
 * @returns {boolean}
 */
const isEmpty = (obj) => !isObj(obj) || !keys(obj).length;

/**
 * If the object property exists, its rounded
 * @param {Object}ob
 * @param {String}prop
 * @param {Number}round
 */
const beRound = (ob, prop, round) => {
	if (ob[prop]) ob[prop] = isNaN(ob[prop]) ? 0 : Number(parseFloat(Number(ob[prop])).toFixed(round));
	return ob;
};

/**
 * Apply function iter for each properties.
 * Use map function.
 *
 * @param obj
 * @param iter
 */
const map = (obj, iter) => keys(obj).map(prop => iter(prop, obj[prop]));


export {
	keys,
	beRound,
	isEmpty,
	each,
	propToArr,
	getPropToArr,
	isSet,
	isObj,
	ext,
	urlParams,
	pathVal,
	isPathExist,
	pathCreate,
	beInObj,
	propInc,
	sort,
	keysChange,
	arrToObjByKey,
	map
};
