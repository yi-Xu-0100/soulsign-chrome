// ==UserScript==
// @name              网易云音乐
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://music.163.com/#/login
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/music.163.js
// @expire            900e3
// @domain            music.163.com
// ==/UserScript==

exports.run = async function() {
	// 手机签到
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=0');
	if (data.code != 200 && data.code != -2) throw data.msg;
	// 电脑签到
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=1');
    if (data.code == -2) return '重复签到';
    if (data.code != 200) throw data.msg;
};

exports.check = async function() {
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=1');
    return data.code == 200 || data.code == -2;
};