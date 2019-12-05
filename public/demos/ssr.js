// ==UserScript==
// @name              ssr签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://qiusudu.com/index.html
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ssr.js
// @expire            900e3
// @domain            qiusudu.com
// @domain            www.ssr222.com
// @domain            167.179.103.53
// ==/UserScript==

exports.run = async function() {
	var { data } = await axios.post('http://www.ssr222.com/user/checkin')
	return data.msg;
};

exports.check = async function() {
	return true;
};