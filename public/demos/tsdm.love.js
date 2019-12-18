// ==UserScript==
// @name            天使动漫
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.3
// @author          inu1255
// @loginURL        https://www.tsdm.live
// @updateURL       https://soulsign.inu1255.cn/script/inu1255/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB.js
// @expire          14400e3
// @domain          www.tsdm.live
// @param           say 签到时说些什么,可用|分隔
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.get('https://www.tsdm.live/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return "已经签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var ss = (param.say || "开心").split('|');
    var say = encodeURIComponent(ss[Math.floor(Math.random() * ss.length)]);
    var { data } = await axios.post('https://www.tsdm.live/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1', `formhash=${formhash}&qdxq=kx&qdmode=1&todaysay=${say}&fastreply=1`);
    if (/签到成功/.test(data)) return '签到成功';
    if (/已经签到/.test(data)) return '已经签到';
    throw '签到失败';
};

exports.check = async function(param) {
    var { data } = await axios.get('https://www.tsdm.live/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return true;
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) return false;
    return true;
};