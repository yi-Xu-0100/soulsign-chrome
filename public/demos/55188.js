// ==UserScript==
// @name              理想论坛签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://www.55188.com/sign.php
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/55188.js
// @expire            900e3
// @domain            www.55188.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.post('https://www.55188.com/addsign.php');
    if (data == 1) return '已签到';
    if (data == '>1') throw '需要登录';
    return '签到成功';
};

exports.check = async function() {
    var { data } = await axios.post('https://www.55188.com/addsign.php');
    return data != '>1';
};