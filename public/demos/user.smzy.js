// ==UserScript==
// @name              数码资源网
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://user.smzy.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/52pojie.js
// @expire            900e3
// @domain            user.smzy.com
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://user.smzy.com/index.php/Weixin/ajax_sign.html?openid=oyiknw0BUqfS3rTpYc3Ejs4zxu9Y&mid=253835&type=new&now=');
    if (/已经签到/.test(data)) return '已经签到';
    if (/签到成功/.test(data)) return data.slice(5);
    throw data.slice(0,10);
};

exports.check = async function() {
	return true
};