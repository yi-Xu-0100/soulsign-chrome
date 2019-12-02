// ==UserScript==
// @name              吾爱破解
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          https://www.52pojie.cn/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/52pojie.js
// @expire            900e3
// @domain            www.52pojie.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2');
    if (/任务已完成/.test(data)) return '任务已完成';
    if (/本期您已申请过此任务/.test(data)) return '签过了';
    if (/需要先登录/.test(data)) throw '未登录';
    throw '失败';
};

exports.check = async function() {
    var { status, data } = await axios.get('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2', { maxRedirects: 0 });
    if (/需要先登录/.test(data)) return false;
    return status == 302 || /本期您已申请过此任务/.test(data);
};
