// ==UserScript==
// @name              领扣中国签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://leetcode-cn.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/leetcode-cn.js
// @expire            900e3
// @domain            leetcode-cn.com
// ==/UserScript==
exports.run = async function() {
	var { data } = await axios.get('https://leetcode-cn.com/explore/');
	if (!/isSignedIn: true/.test(data)) throw '没有登录';
	if(/每日登录/.test(data)) return '签到成功'; 
	return '已经签到';
};

exports.check = async function() {
    var { data } = await axios.get('https://leetcode-cn.com/explore/');
	return /isSignedIn: true/.test(data);
};