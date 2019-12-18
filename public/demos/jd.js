// ==UserScript==
// @name              京东PC
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://passport.jd.com/new/login.aspx
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/%E4%BA%AC%E4%B8%9CPC.js
// @expire            900e3
// @domain            vip.jd.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://vip.jd.com/sign/index');
    if (/签到成功/.test(data)) return '签到成功';
    if (/请明日再来/.test(data)) return '请明日再来';
    throw '失败';
};

exports.check = async function() {
    var { status } = await axios.get('https://vip.jd.com/home.html', { timeout: 10e3, maxRedirects: 0 });
    return status == 200;
};