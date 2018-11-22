// ==UserScript==
// @name              吾爱油猴签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://52youhou.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/52pojie.js
// @expire            900e3
// @domain            52youhou.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.post('https://52youhou.com/wp-content/themes/LightSNS/module/action/sign.php', 'sign=1', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
    if (data.code == 2) return '签到成功';
    if (data.code == 1) return data.msg;
    throw '失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://52youhou.com');
    return data.indexOf('"nickname":"') >= 0;
};