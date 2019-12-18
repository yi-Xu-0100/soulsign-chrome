// ==UserScript==
// @name              MIUI论坛
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          http://www.miui.com/index.html
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/MIUI%E8%AE%BA%E5%9D%9B.js
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