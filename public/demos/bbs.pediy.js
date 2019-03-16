// ==UserScript==
// @name              看雪论坛
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://bbs.pediy.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/bbs.pediy.js
// @expire            900e3
// @domain            bbs.pediy.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://bbs.pediy.com/user-signin.htm');
    if (+data.message) return `获得${data.message}雪币`;
    return data.message;
};

exports.check = async function() {
    var { data } = await axios.get('https://bbs.pediy.com/user-signin.htm');
    return !/登录/.test(data.message);
};