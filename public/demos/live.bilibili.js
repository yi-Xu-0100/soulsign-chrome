// ==UserScript==
// @name              bilibili直播
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://passport.bilibili.com/login
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/live.bilibili.js
// @expire            900e3
// @domain            api.live.bilibili.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://api.live.bilibili.com/sign/doSign');
    if (data.code == 0) return data.data.text;
    if (data.code == 1011040) return data.message;
    throw data.message;
};

exports.check = async function() {
    var { data } = await axios.get('https://api.live.bilibili.com/User/userOnlineHeart');
    return data.code === 0;
};