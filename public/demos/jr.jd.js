// ==UserScript==
// @name              京东金融PC
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://vip.jr.jd.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/jr.jd.js
// @expire            900e3
// @domain            vip.jr.jd.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.post('http://vip.jr.jd.com/newSign/doSign', null, { headers: { Referer: 'http://vip.jr.jd.com/' } });
    if (data.signSuccess) return '签到成功';
    throw data.message;
};

exports.check = async function() {
    var { data } = await axios.post('http://vip.jr.jd.com/newSign/doSign', null, { headers: { Referer: 'http://vip.jr.jd.com/' } });
    return data.signSuccess;
};