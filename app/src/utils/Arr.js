/**
 * Created by igor on 30.05.16.
 * @module arr
 * @description Function for array
 */

/**
 * Check parameter be array. if not return empty array
 * @param {*} arr
 */
const check = (arr) => Array.isArray(arr) ? arr : [];

/**
 * By default the sort method sorts elements alphabetically.
 * To sort numerically just add a new method which handles numeric sorts
 * e.g. [11, 1, 2].sort(utils.sortNumber);
 * @method sortNumber
 * @param  {Number}   a
 * @param  {Number}   b
 * @return {Number}
 */
const sortNumber = (a, b)  => parseFloat(a) - parseFloat(b);
/**
 *  Return share part of the array
 * @param arr1
 * @param arr2
 * @returns {Array}
 */
const share = (arr1, arr2) => check(arr1).filter( (val) => check(arr2).indexOf(val) !== -1 );

/**
 * Return different part of the array
 * @param	{Array} arr1
 * @param	{Array} arr2
 * @return {Array}
 */
const diff =  (arr1, arr2) => Array.isArray(arr2) ? check(arr1).filter((i) => arr2.indexOf(i) === -1 ) : [] ;

/**
 * Clear repeat values
 * @param {Array} arr
 */
const unique = (arr) => check(arr).filter((value, index, self) => self.indexOf(value) === index);

/**
 * Delete all elements whith specified value
 * @param {Array} arr массив для очистки
 * @param {*} value значение
 */
const mvVal = (arr, value) => check(arr).filter((v) => v !== value);

/**
 * Sum of array elements
 * @return {Number}
 */
const sum = (a) => (Array.isArray(a)) ? a.reduce( (pv, cv) => (isNaN(pv) ? 0 : Number(pv)) + (isNaN(cv) ? 0 : Number(cv)), 0) : 0;

/**
 * Return average elements array
 * @param {Array}a
 * @returns {number}
 */
const avg = (a) => (!Array.isArray(a) || !a.length ) ? 0 : sum(a) / a.length;

/**
 * Return array. When element is url collect from specified array
 * @param {Array}arr
 * @returns {Array}
 */
const urls = (arr) => {
	let r = [];
	arr = arr || [];
	arr = Array.isArray(arr) ? arr : [arr];

	for (let i = 0; i < arr.length; ++i) {
		let el = arr[i] || '';

		el = el.trim().toLowerCase();

		if (el.indexOf('://') === -1) el = 'http://' + el;

		if (/^htt(p|ps)\:\/\/(.*)+\.(.*)+$/.test(el)) r.push(el);
	}

	return r;
};

export {urls, avg, sum, mvVal, unique, diff, share, sortNumber, check};
