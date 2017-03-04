/**
 * Created by igor on 04.02.17.
 */
const webdriver = require('selenium-webdriver');

require('geckodriver');
require('chromedriver');

const fs = require('fs');
const data = require('./browser/test-data/index.js');
const utilMy = require('utils-igor')('obj');
const async = require('async');
const By = webdriver.By;
const until = webdriver.until;
const driver = new webdriver.Builder()
	.forBrowser('chrome')
	.build();

const loadData = () => new Promise((resolve) => {
	driver.executeScript(() => {
		var params = arguments[0];

		Object.keys(params).map(id => {
			var elems = document.getElementById(id);
			elems.value = params[id];
		});

	}, data).then(() => {

		utilMy.each(data, (key, val) => {
			let $input = driver.findElement(By.id(key));
			$input.sendKeys(' ');
		});

		resolve();
	});

});

let browserGetResult = call => {
	driver.get(`http://localhost:${process.env.port}/`)
		.then(loadData())
		.then(r => driver.executeScript(() => {
			var elems = document.getElementById('submit');
			elems.click();
			return true;
		}))
		.then(r => driver.wait(() => driver.executeScript(() => {
			var $sucess = document.getElementsByClassName('alert-success');
			return $sucess && $sucess.length;
		}), 500))
		.then(r => {
			driver.quit();
			call(r);

			// driver.wait(until.titleIs('webdriver - Google Search'), 6000);
		});
};

describe('End-to-end', (suite) => {
	let isResult;

	before(done => {
		browserGetResult(getResult => {
			isResult  = getResult;
			done();
		});
	});

	it('status 200', done => {
		if (!isResult)
			throw new Error('Test failing');
		done();
	});

	let dir = __dirname + '/browser/test-result';

	it('Have files', done => {
		fs.readdir(dir, (e, files) => {
			if (e) {
				console.log('ERR', e);
				throw new Error('No read test result folder.');

			}

			const filesCount = files.length;

			if (filesCount !== 2) {
				throw new Error('No correct files count. Files count ' + filesCount);
			}

			async.map(files, (file, next) => fs.unlink(dir + '/' + file, next), e => {
				if (e) {
					console.log('Err/Files/Delete.', e);
				}

				done();
			});

		});
	});
});
