// ==UserScript==
// @name              bilibili直播
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          https://passport.bilibili.com/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/bilibili%E7%9B%B4%E6%92%AD.js
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
    var { data } = await axios.get('https://api.live.bilibili.com/relation/v1/Feed/heartBeat');
    return data.code === 0;
};
