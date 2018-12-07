// ==UserScript==
// @name              四川移动签到+大转盘
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://wap.sc.10086.cn/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/wap.sc.10086.js
// @expire            900e3
// @domain            wap.sc.10086.cn
// @param             SSOCookie SSOCookie,通过抓包获取
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('http://wap.sc.10086.cn/scmccCampaign/signCalendar/sign.do', 'SSOCookie='+param.SSOCookie);
    var { data } = await axios.post('http://wap.sc.10086.cn/scmccCampaign/dazhuanpan/dzpDraw.do', 'SSOCookie='+param.SSOCookie);
    return data.dzpDraw.info;
};

exports.check = async function() {
    return true;
};