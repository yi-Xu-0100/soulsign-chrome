// ==UserScript==
// @name              wps游戏积分
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          https://vip.wps.cn/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/wps%E6%B8%B8%E6%88%8F%E7%A7%AF%E5%88%86.js
// @expire            900e3
// @domain            vipapi.wps.cn
// ==/UserScript==

exports.run = async function() {
    await axios.post('https://vipapi.wps.cn/vip_game/v1/flip/user/total_score', 'score=' + (Math.floor(Math.random() * 10) + 100), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    });
    var { data } = await axios.post('https://vipapi.wps.cn/vip_game/v1/flip/user/score', `score=255&rand=${Math.floor(new Date()/1e3)}&score_type=0`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    });
    if (data.result == 'ok') return `成功`;
    throw data.msg;
};

exports.check = async function() {
    var { data } = await axios.get('https://vipapi.wps.cn/vip_game/v1/flip/user');
    return data.result == 'ok';
};