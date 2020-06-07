 // ==UserScript==
// @name             ssr机场签到
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            marvolo666
// @loginURL         https://你的机场网址/auth/login
// @expire            900e3
// @domain            你的机场网址
// @param             name 账户
// @param             pwd 密码
// ==/UserScript==

/**
 * 签到接口，可以使用axios库发起请求,请求url域名必须通过@domain声明
 * throw 签到失败并抛出失败原因
 * return 签到成功并返回成功信息
 * 把你的机场网址替换成你买的机场就行了，适配许多机场，如果签到过了还是报错失败未登录，估计是下面“您似乎已经签到过了”的消息 需要换成你用的机场的消息
 */
exports.run = async function(param) {	
	axios.post('https://你的机场网址/auth/login',{email:param.name,passwd: param.pwd});
	var data= await axios.post('https://你的机场网址/user/checkin');
	if(/成功/.test(data.data.msg))
		return data.data.msg;
	else if(/您似乎已经签到过了/.test(data.data.msg))
		return data.data.msg;
	else{
		throw '未登录';
	}
};

exports.check = async function(param) {
	var  {data} = await axios.get('https://你的机场网址/user');
	if(/用户中心/.test(data)){
		return true;
	}
	else{
		axios.post('https://你的机场网址/auth/login',{email:param.name,passwd: param.pwd});
	}
};

