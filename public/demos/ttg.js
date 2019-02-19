// ==UserScript==
// @name            TTG
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://totheglory.im
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ttg.js
// @expire          14400e3
// @domain          totheglory.im
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://totheglory.im/index.php');
    if (/欢迎回来/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://totheglory.im/index.php');
    return /欢迎回来/.test(data);
};