// ==UserScript==
// @name              京东金融PC
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          http://passport.jd.com/new/login.aspx
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/%E4%BA%AC%E4%B8%9C%E9%87%91%E8%9E%8DPC.js
// @expire            900e3
// @domain            vip.jr.jd.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.post('https://vip.jr.jd.com/newSign/doSign', null, { headers: { Referer: 'https://vip.jr.jd.com/' } });
    if (data.signSuccess) return '签到成功';
    throw data.message;
};

exports.check = async function() {
    var { data } = await axios.post('https://vip.jr.jd.com/newSign/doSign', null, { headers: { Referer: 'https://vip.jr.jd.com/' } });
    return data.signSuccess;
};