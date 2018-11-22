// ==UserScript==
// @name              wps游戏积分
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://vip.wps.cn/login
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/vipapi.wps.js
// @expire            900e3
// @domain            vipapi.wps.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.post('https://vipapi.wps.cn/vip_game/v1/flip/user/score', `score=40&rand=${Math.floor(new Date()/1e3)}&score_type=0`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    });
    if (data.result == 'ok') return `获得${data.data.add_integral}积分`;
    throw data.msg;
};

exports.check = async function() {
    var { data } = await axios.get('https://vipapi.wps.cn/vip_game/v1/flip/user');
    return data.result == 'ok';
};