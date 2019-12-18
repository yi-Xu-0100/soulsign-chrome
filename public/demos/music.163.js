// ==UserScript==
// @name              网易云音乐
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://music.163.com/#/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90.js
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