// ==UserScript==
// @name              四川移动签到+大转盘
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://wap.sc.10086.cn/
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/%E5%9B%9B%E5%B7%9D%E7%A7%BB%E5%8A%A8%E7%AD%BE%E5%88%B0+%E5%A4%A7%E8%BD%AC%E7%9B%98.js
// @expire            900e3
// @domain            wap.sc.10086.cn
// @param             SSOCookie SSOCookie,通过抓包获取
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('http://wap.sc.10086.cn/scmccCampaign/mixMarketing/lowdraw.do', 'SSOCookie='+param.SSOCookie);
    return data.result.info;
};

exports.check = async function() {
    return true;
};