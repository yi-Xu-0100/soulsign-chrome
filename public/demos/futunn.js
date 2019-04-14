// ==UserScript==
// @name            富途牛牛
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          inu1255
// @loginURL        https://www.futunn.com
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/futunn.js
// @expire          14400e3
// @domain          www.futunn.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.futunn.com/site/sign-in');
    if (data.code == 0) return `签到${data.data.signInDays}天`;
    if (data.code == 3004) return data.message;
    throw data.message;
};

exports.check = async function() {
    var { data } = await axios.get('https://www.futunn.com/site/sign-in');
    return data.code == 0 || data.code == 3004;
};