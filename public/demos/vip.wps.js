// ==UserScript==
// @name              wps打卡领会员
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://zt.wps.cn/2018/clock_in
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/vip.wps.js
// @expire            900e3
// @domain            zt.wps.cn
// ==/UserScript==

exports.run = async function() {
    var { status, data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/get_question', { maxRedirects: 0, validateStatus: s => true });
    if (status == 302) throw '需要登录';
    let answer = 1;
    for (let i = 0; i < data.data.options.length; i++) {
        let row = data.data.options[i];
        if (/WPS/.test(row)) {
            answer = i + 1;
            break;
        }
    }
    var { data } = await axios.post('https://zt.wps.cn/2018/clock_in/api/answer', { answer });
    if (data.result != 'ok') throw data.msg;
    var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/clock_in');
    if (data.msg == '已打卡') return '已打卡';
    if (data.result != 'ok') throw data.msg;
};

exports.check = async function() {
    var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/sign_up?sid=0&from=&csource=');
    return data.msg == '已参加挑战' || data.result == 'ok';
};