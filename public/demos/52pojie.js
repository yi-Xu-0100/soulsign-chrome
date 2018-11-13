// ==UserScript==
// @name              吾爱破解
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://www.52pojie.cn/
// @expire            900e3
// @domain            www.52pojie.cn
// ==/UserScript==

exports.run = async function() {
    var { data } = await axios.get('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2');
    if (/任务已完成/.test(data)) return '任务已完成';
    if (/本期您已申请过此任务/.test(data)) return '签过了';
    throw '失败';
};

exports.check = async function() {
    var { status, data } = await axios.get('https://www.52pojie.cn/home.php?mod=task&do=apply&id=2', { maxRedirects: 0 });
    return status == 302 || /本期您已申请过此任务/.test(data);
};