// ==UserScript==
// @name              字幕组签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://www.zimuzu.io/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/zimuzu.js
// @expire            900e3
// @domain            www.zimuzu.io
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://www.zimuzu.io/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.zimuzu.io/' } });
    if (data.status == 1) {
        if (data.data.new_login)
            return `签到成功,共${data.data.userinfo.point}积分`;
        return `已签到,共${data.data.userinfo.point}积分`;
    }
    throw '需要登录';
};

exports.check = async function() {
    var { data } = await axios.get('http://www.zimuzu.io/user/login/getCurUserTopInfo', { headers: { 'Referer': 'http://www.zimuzu.io/' } });
    return data.status == 1;
};