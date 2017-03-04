
import {ext, map, isObj, urlParams} from './Obj';

/**
 * Send to server.
 * @method send
 * @param  {string} url
 * @param  {*} data
 * @param  {*} method
 * @param  {*} headers
 * @return {Promise}
 */
const send = (url, data, method, headers) => new Promise((resolve, reject) => {
	let xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = r => {
		try {
			let data = JSON.parse(r.target.responseText);
			resolve(data);
		} catch (e) {
			console.error('Prase responce bad', e);
			reject(e);
		}

	};

	xhr.onerror = reject;

	map(ext({
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded'
	}, headers), (key, val) => xhr.setRequestHeader(key, val));

	xhr.send(isObj(data) ? urlParams(data) : null);
});

/**
 * Send for save.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const save   = (url, data, headers) => send(url, data, 'POST', headers);
/**
 * Send for get.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const get    = (url, data, headers) => send(url, data, 'GET', headers);
/**
 * Send for delete.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const move = (url, data, headers) => send(url, data, 'DELETE', headers);
/**
 * Send for update.
 * @method save
 * @param  {string} url
 * @param  {*} data
 * @param  {*} headers
 * @return {Promise}
 */
const update = (url, data, headers) => send(url, data, 'PUT', headers);

export { save, get, move, update };
