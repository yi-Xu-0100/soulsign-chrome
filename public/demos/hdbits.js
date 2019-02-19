// ==UserScript==
// @name            HDBits
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://hdbits.org
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/hdbits.js
// @expire          14400e3
// @domain          hdbits.org
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://hdbits.org/browse.php');
    if (/Logout/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://hdbits.org/browse.php');
    return /Logout/.test(data);
};