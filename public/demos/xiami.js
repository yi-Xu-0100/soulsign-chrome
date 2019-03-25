// ==UserScript==
// @name              虾米音乐
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://www.xiami.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/xiami.js
// @expire            900e3
// @domain            www.xiami.com
// @param             s 请求小尾巴
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.post('https://www.xiami.com/api/task/xiamiSignIn?_s=' + param.s, null, {
        headers: {
            'referer': 'https://www.xiami.com/',
            'origin': ' https://www.xiami.com',
        }
    });
    if (data.msg==="请求无效") throw "请设置请求小尾巴";
    if (data.msg) throw data.msg;
    return data.result.data.content;
};

exports.check = async function(param) {
    if (!param.s) return false;
    var { data } = await axios.post('https://www.xiami.com/api/task/xiamiSignIn?_s=' + param.s, null, {
        headers: {
            'referer': 'https://www.xiami.com/',
            'origin': ' https://www.xiami.com',
        }
    });
    return data.result;
};