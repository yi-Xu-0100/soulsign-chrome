// ==UserScript==
// @name              腾讯视频VIP会员签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            sy-records
// @loginURL          https://film.qq.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/filmqq.js
// @expire            900e3
// @domain            vip.video.qq.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://vip.video.qq.com/fcgi-bin/comm_cgi?name=hierarchical_task_system&cmd=2');
    var res = JSON.parse(data.match(/QZOutputJson=\((.*)\)/)[1]);
    if (res['ret'] != 0) throw res['msg'];
    if(res['ret'] == 0 && res['msg'] == "OK" && res['checkin_score'] != 0) return res['msg'] + '获得成长值：'.res['checkin_score'];
    if(res['ret'] == 0 && res['msg'] == "OK") return '重复签到';
};
exports.check = async function() {
    var { data } = await axios.get('https://vip.video.qq.com/fcgi-bin/comm_cgi?name=hierarchical_task_system&cmd=2');
    var res = JSON.parse(data.match(/QZOutputJson=\((.*)\)/)[1]);
    if(res['ret'] == -10006) return false;
    return true;
};
