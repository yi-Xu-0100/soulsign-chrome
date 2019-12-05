// ==UserScript==
// @name              gbbspot
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://inu1255.cn/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ssr.js
// @expire            900e3
// @domain            www.gbbspot.com
// @domain            167.179.103.53
// ==/UserScript==

exports.run = async function() {
    let md5 = await require('https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js');
	let time = Date.now()
	let uid = '14d3b378f02eed85';
	let sig =md5('a72fa1a1c667f5ac7662cfae6ab7f068' + time + uid);
	var json = { time, uid, sig }
	console.log(json)
	var { data } = await axios.post('https://www.gbbspot.com/api/package/finishTask', JSON.stringify(json), {
		headers: {
			authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzc3ODY5MzcxNiIsImF1ZCI6IndlYiIsImV4cCI6NDcyNzIyMzU0MywiaWF0IjoxNTczNjIzNTQzfQ.K7nn0VSn-hpNbcOPwy4C1l1As6BHPYRkGwbOHGDp27R7AzOw1cxL2globvcjCQo2H236Gox5NPk3-DBwSkxAUg",
			version: "5.0.0",
			lang: "0",
			"User-Agent": "okhttp/3.12.1",
		},
		validateStatus: () => true,
	})
	return data.data||data.msg;
};

exports.check = async function() {
	var { data } = await axios.post('https://www.gbbspot.com/api/package/taskStatus', '', {
		headers: {
			authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzc3ODY5MzcxNiIsImF1ZCI6IndlYiIsImV4cCI6NDcyNzIyMzU0MywiaWF0IjoxNTczNjIzNTQzfQ.K7nn0VSn-hpNbcOPwy4C1l1As6BHPYRkGwbOHGDp27R7AzOw1cxL2globvcjCQo2H236Gox5NPk3-DBwSkxAUg",
			version: "5.0.0",
			lang: "0",
			"User-Agent": "okhttp/3.12.1",
		}
	})
	return data.success;
};