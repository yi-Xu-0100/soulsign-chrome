// ==UserScript==
// @name              什么值得买
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://zhiyou.smzdm.com/user/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0.js
// @expire            900e3
// @domain            zhiyou.smzdm.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    if (data.error_code == 0) return '签到成功';
    throw data.error_msg || "失败";
};

exports.check = async function() {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    return data.error_code == 0;
};