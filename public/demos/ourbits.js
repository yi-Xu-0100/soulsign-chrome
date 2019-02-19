// ==UserScript==
// @name            OurBits
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://ourbits.club
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ourbits.js
// @expire          14400e3
// @domain          ourbits.club
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://ourbits.club/attendance.php');
    if (/签到成功/.test(data)) return '签到成功';
    if (/您今天已经签到过了/.test(data)) return '今日已签';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://ourbits.club/index.php');
    return /欢迎回来/.test(data);
};