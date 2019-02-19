// ==UserScript==
// @name            HDHome
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://hdhome.org
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/hdhome.js
// @expire          14400e3
// @domain          hdhome.org
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://hdhome.org/attendance.php');
    if (/签到成功/.test(data)) return '签到成功';
    if (/您今天已经签到过了/.test(data)) return '今日已签';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://hdhome.org/index.php');
    return /欢迎回来/.test(data);
};