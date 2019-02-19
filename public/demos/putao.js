// ==UserScript==
// @name            PuTao
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://pt.sjtu.edu.cn
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/putao.js
// @expire          14400e3
// @domain          pt.sjtu.edu.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://pt.sjtu.edu.cn');
    if (/控制面板/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://pt.sjtu.edu.cn');
    return /控制面板/.test(data);
};