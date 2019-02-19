// ==UserScript==
// @name            PSNINE
// @namespace       https://github.com/inu1255/soulsign-chrome
// @version         1.0.0
// @author          GSM
// @loginURL        https://www.psnine.com/
// @updateURL       https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/psnine.js
// @expire          14400e3
// @domain          www.psnine.com
// ==/UserScript==

exports.run = async function() {
    try{
        var { status, data } = await axios.get('https://www.psnine.com/set/qidao/ajax');
        if (/你已祈祷/.test(data)) return '签到成功';
    }catch(e){
        if( e.response.status == 404 && /今天已经签过了/.test(e.response.data))
            return '今日已签';
    }
    throw '失败';
};

exports.check = async function() {
    var { data } = await axios.get('https://www.psnine.com');
    return /我收藏的/.test(data);
};