// ==UserScript==
// @name              猎云网高木投票
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://www.lieyunwang.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/jr.jd.js
// @expire            900e3
// @domain            www.lieyunwang.com
// ==/UserScript==

exports.run = async function() {
    let vote = 1;
    let count = 0;
    while (vote > 0) {
        var { data } = await axios.get('http://www.lieyunwang.com/ntopic/summit2018-vote?id=7913');
        if (data.code == 1) return data.message;
        if (data.code != 0) throw data.message;
        vote = data.data.vote;
        count = data.data.count;
    }
    return `投票${count}次`;
};

exports.check = async function() {
    var { data } = await axios.get('http://www.lieyunwang.com/ntopic/summit2018-vote?id=7913');
    return data.code === 0 || data.code === 1;
};