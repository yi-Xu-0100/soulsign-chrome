// ==UserScript==
// @name              字幕组签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://www.zimuzu.tv/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/zimuzu.js
// @expire            900e3
// @domain            www.zimuzu.tv
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('http://www.zimuzu.tv/user/login/getCurUserTopInfo', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    if (data.status == 1) {
        if (data.data.new_login)
            return `签到成功,共${data.data.userinfo.point}积分`;
        return `已签到,共${data.data.userinfo.point}积分`;
    }
    throw '需要登录';
};

exports.check = async function() {
    var { data } = await axios.get('http://www.zimuzu.tv/user/login/getCurUserTopInfo', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    return data.status == 1;
};