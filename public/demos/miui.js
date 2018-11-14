// ==UserScript==
// @name              MIUI论坛
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://www.miui.com/index.html
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/miui.js
// @expire            900e3
// @domain            www.miui.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://www.miui.com/extra.php?mod=sign/index&op=sign');
    if (!data.uid) throw '需要登录';
    return data.message;
};

exports.check = async function() {
    var { data } = await axios.get('http://www.miui.com/extra.php?mod=sign/index&op=sign');
    return data.uid > 0;
};