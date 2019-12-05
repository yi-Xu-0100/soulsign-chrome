// ==UserScript==
// @name              圆通积分
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.1
// @author            inu1255
// @loginURL          http://ec.yto.net.cn/login.htm
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/ec.yto.js
// @expire            900e3
// @domain            ec.yto.net.cn
// ==/UserScript==

exports.run = async function() {
	if(this.check())
        return '成功';
    throw '失败';
};

exports.check = async function() {
	let { data, status } = await axios.post('http://ec.yto.net.cn/api/usersignin', {}, {
		maxRedirects: 0,
		validateStatus: s => true,
		headers: {
			'referer': 'http://ec.yto.net.cn/home',
			source: 'PC',
			'jwt-token': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1Njg5NDkwMzEsInN1YiI6IntcInByb3ZpZGVyTmFtZVwiOlwiTG9naW5Ub2tlblByb3ZpZGVyXCIsXCJkdXJhdGlvblwiOjMwLFwidXNlcklkXCI6NDU0NjMxMzYsXCJ1c2VybmFtZVwiOlwiMTg3ODIwNzEyMTlcIixcImVuYWJsZWRcIjp0cnVlLFwiY3JlZGVudGlhbHNOb25FeHBpcmVkXCI6ZmFsc2UsXCJhY2NvdW50Tm9uRXhwaXJlZFwiOmZhbHNlLFwiYWNjb3VudE5vbkxvY2tlZFwiOmZhbHNlfSJ9.RAcTpMsZZWOrCra7jxDz5-qOCteeMCcaq0fq4vy3lB8',
		}
	});
	return !data.error
};