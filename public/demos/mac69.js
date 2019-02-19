// ==UserScript==
// @name              Mac天空
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://www.mac69.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/mac69.js
// @expire            900e3
// @domain            www.mac69.com
// ==/UserScript==
const opt = {
    headers: {
        'origin': 'https://www.mac69.com',
        'X-Requested-With': 'XMLHttpRequest',
        'referer': 'https://www.mac69.com/mac/pm',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
};
exports.run = async function() {
    // 这个网站很贱，多抽还要消耗积分
    var { data } = await axios.post('https://www.mac69.com/pay_spend', 'page=1', opt);
    if (data.code != 200) throw '没有登录';
    if (new Date(data.data.info[0].add_time * 1e3).toLocaleDateString() == new Date().toLocaleDateString()) return '签过了';
    var { data } = await axios.post('https://www.mac69.com/sign_prize', '', opt);
    return data.id;
};

exports.check = async function() {
    var { data } = await axios.post('https://www.mac69.com/pay_spend', 'page=1&add_time=1&spend_type=0&msg=', opt);
    return data.code == 200;
};
