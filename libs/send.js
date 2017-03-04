const ok = 'OK';
const err = 'BAD';

/**
 * Wrap for response send.
 * @method send
 * @param  {response} res
 * @param  {constant} status
 * @param  {*} data
 * @return {response}
 */
let send = (res, status, data) => {
	res.json({
		status : status,
		data : data
	});
};

module.exports = {
	/**
	 * Constant for response
	 * @type {ok:string, err: string}
	 */
	constant : {
		ok : ok,
		err : err
	},
	/**
	 * Response Sucess.
	 * @method ok
	 * @param  {response} res
	 * @param  {*} data
	 * @return {response}
	 */
	ok : (res, data) => send(res, ok, data),
	/**
	 * Responce fail.
	 * @method err
	 * @param  {response} res
	 * @param  {*} data
	 * @return {response}
	 */
	err : (res, data) => send(res, err, data)
};
