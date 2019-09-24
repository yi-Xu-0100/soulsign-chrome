// ==UserScript==
// @name            HDU
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          sununs
// @loginURL        http://pt.upxin.net
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/hdu.js
// @expire          14400e3
// @domain          pt.upxin.net
// ==/UserScript==

exports.run = async function() {
    var { data,status } = await axios.post('http://pt.upxin.net/added.php', 'action=qiandao',{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
    if (status == 200) return '签到成功';
    throw '签到失败';
};

exports.check = async function() {
    var { data } = await axios.get('http://pt.upxin.net/index.php');
    return /欢迎回来/.test(data);
};
