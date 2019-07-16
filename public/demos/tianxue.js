// ==UserScript==
// @name            天雪论坛
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          Winrey
// @loginURL        https://www.skyey2.com/
// @expire          14400e3
// @domain          www.skyey2.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.skyey2.com');
    if (/我的/.test(data)) return '访问成功';
    throw '访问失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://www.skyey2.com');
    return /我的/.test(data);
};
