// ==UserScript==
// @name              卡饭
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          https://bbs.kafan.cn/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/kafan.js
// @expire            900e3
// @domain            bbs.kafan.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/');
    var m = /formhash=([^"]+)/.exec(data);
    if (!m) throw '未定位xss';
    var { data } = await axios.get('https://bbs.kafan.cn/plugin.php?id=dsu_amupper&ppersubmit=true&formhash=' + m[1] + '&infloat=yes&handlekey=dsu_amupper&inajax=1&ajaxtarget=fwin_content_dsu_amupper');
    if (/累计签到/.test(data)) return '累计签到';
    if (/已签到/.test(data)) return '已签到';
    if (/成功/.test(data)) return '成功';
    throw '失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://bbs.kafan.cn/forum.php');
    return !/QQ快速登录/.test(data);
};