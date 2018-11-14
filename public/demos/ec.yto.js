// ==UserScript==
// @name              圆通积分
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://ec.yto.net.cn/login.htm
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ec.yto.js
// @expire            900e3
// @domain            ec.yto.net.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://ec.yto.net.cn/checkIn/checkIn.htm');
    if (/您今天已经签过到了/.test(data)) return '已经签过了';
    if (/恭喜成功领取到/.test(data)) return '成功';
    throw '失败';
};

exports.check = async function() {
    var { data } = await axios.get('http://ec.yto.net.cn/checkIn/checkIn.htm');
    return /您今天已经签过到了|恭喜成功领取到/.test(data);
};