// ==UserScript==
// @name            红岭论坛
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://sso.my089.com/sso?back_url=https%3A%2F%2Fwww.my089.com%2F
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/hongling.js
// @expire          14400e3
// @domain          bbs.my089.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://bbs.my089.com/userSignByDay');
    if (/登录/.test(data)) throw '需要登录';
    if (data.flag==1) return '签到成功';
    if (data.flag==0) return '今日已签';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://bbs.my089.com/');
    return /我的账户/.test(data);
};