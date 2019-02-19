// ==UserScript==
// @name            MTeam
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://tp.m-team.cc/
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/mteam.js
// @expire          14400e3
// @domain          tp.m-team.cc
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://tp.m-team.cc');
    if (/歡迎回來/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://tp.m-team.cc');
    return /歡迎回來/.test(data);
};