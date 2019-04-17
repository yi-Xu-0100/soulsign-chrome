// ==UserScript==
// @name            富途牛牛
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.1
// @author          inu1255
// @loginURL        https://www.futunn.com
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/futunn.js
// @expire          14400e3
// @domain          www.futunn.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.futunn.com/account/home');
    var m = /csrf-token" content="([^"]+)/.exec(data);
    if(!m) throw '未定位csrf';
    var { data } = await axios.post('https://www.futunn.com/site/sign-in', '', {
        headers: {
            'X-CSRF-Token': m[1],
        }
    });
    if (data.code == 0) return `签到${data.data.signInDays}天`;
    if (data.code == 3004) return data.message;
    throw data.message;
};

exports.check = async function() {
    var { data } = await axios.get('https://www.futunn.com/account/home');
    var m = /csrf-token" content="([^"]+)/.exec(data);
    if(!m) throw '未定位csrf';
    var { data } = await axios.post('https://www.futunn.com/site/sign-in', '', {
        headers: {
            'X-CSRF-Token': m[1],
        }
    });
    return data.code == 0 || data.code == 3004;
};