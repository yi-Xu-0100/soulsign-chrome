// ==UserScript==
// @name            Chiphell
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://www.chiphell.com
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/chiphell.js
// @expire          14400e3
// @domain          www.chiphell.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.chiphell.com/forum.php');
    if (/积分:/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://www.chiphell.com/forum.php');
    return /积分:/.test(data);
};