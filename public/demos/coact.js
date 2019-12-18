// ==UserScript==
// @name              coact通知
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.2
// @author            inu1255
// @loginURL          https://ext.gaomuxuexi.com:4430/
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/coact%E9%80%9A%E7%9F%A5.js
// @expire            300e3
// @domain            ext.gaomuxuexi.com
// @grant             notify
// @param             ACCOUNT 账号
// @param             PWD 密码
// ==/UserScript==

exports.run = async function(param) {
	if (!await this.check(param)) throw '需要登录';
	return '成功';
};

exports.check = async function(param) {
	if (!param.uid) { // 获取 UID
		var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/u_login", param);
		if (data.no != 200) throw data.msg;
		param.uid = data.usr.id;
	}
	let TIMES = ["iTChg", "iTCreate", "iTRe", "tCall"];
	let now = Date.now();
	var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/inf_qry", {
		UIDDO: `[${param.uid}]`,
		RateMax: 99,
		sp: { "t": "Plan", "sp": 0, "dt": now },
	});
	if (data.no == 401) {
		var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/u_login", param);
		if (data.no != 200) throw data.msg;
		param.uid = data.usr.id;
	}
	let tasks = [];
	let iID = 0;
	for (let row of data.inf) {
		for (let key of TIMES) {
			if (row.tOpen < row[key]) {
				iID = row.iID;
				tasks.push(`[待完成]${row.iTit}`);
				break;
			}
		}
	}
	var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/called_qry", {
		Status: -1,
		sp: { "t": "Call", "sp": 7, "dt": now },
		TCallMax: now,
		TCallMin: now - 7 * 86400e3,
	});
	for (let row of data.inf) {
		for (let key of TIMES) {
			if (row.tOpen < row[key]) {
				iID = row.iID;
				tasks.push(`[@]${row.iTit}`);
				break;
			}
		}
	}
	var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/follow_qry", {
		Status: -1,
		sp: { "t": "Call", "sp": 7, "dt": now },
		TCallMax: now,
		TCallMin: now - 7 * 86400e3,
	});
	for (let row of data.inf) {
		for (let key of TIMES) {
			if (row.tOpen < row[key]) {
				iID = row.iID;
				tasks.push(`[关注]${row.iTit}`);
				break;
			}
		}
	}
	if (tasks.length) {
		notify(tasks.join(' '), `https://ext.gaomuxuexi.com:4430/topic.htm#${iID}`);
	}
	return true;
};