// ==UserScript==
// @name              虾米音乐
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          https://www.xiami.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/xiami.js
// @expire            28800e3
// @grant             require
// @grant             cookie
// @domain            www.xiami.com
// ==/UserScript==

exports.run = async function() {
    let md5 = await require('https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js');
    let a = await getCookie('https://www.xiami.com/', 'xm_sg_tk') || '';
    let s = md5(a.split("_")[0] + "_xmMain_/api/task/xiamiSignIn_");
    var { data } = await axios.post('https://www.xiami.com/api/task/xiamiSignIn?_s=' + s, null, {
        headers: {
            'referer': 'https://www.xiami.com/',
            'origin': ' https://www.xiami.com',
        }
    });
    if (data.msg === "请求无效") throw "请设置请求小尾巴";
    if (data.msg) throw data.msg;
    return data.result.data.content;
};

exports.check = async function() {
    let md5 = await require('https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js');
    let a = await getCookie('https://www.xiami.com/', 'xm_sg_tk') || '';
    let s = md5(a.split("_")[0] + "_xmMain_/api/task/xiamiSignIn_");
    var { data } = await axios.post('https://www.xiami.com/api/task/xiamiSignIn?_s=' + s, null, {
        headers: {
            'referer': 'https://www.xiami.com/',
            'origin': ' https://www.xiami.com',
        }
    });
    return data.result;
};