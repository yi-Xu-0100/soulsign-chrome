// ==UserScript==
// @name              网易云音乐
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.1
// @author            inu1255
// @loginURL          https://music.163.com/#/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/网易云音乐
// @expire            900000
// @domain            music.163.com
// @param             name 账号
// @param             pwd 密码
// ==/UserScript==

exports.run = async function() {
	// 手机签到
	var {data} = await axios.get("http://music.163.com/api/point/dailyTask?type=0");
	if (data.code != 200 && data.code != -2) throw data.msg;
	// 电脑签到
	var {data} = await axios.get("http://music.163.com/api/point/dailyTask?type=1");
	if (data.code == -2) return "重复签到";
	if (data.code != 200) throw data.msg;
};

exports.check = async function(param) {
	var {data} = await axios.get("http://music.163.com/api/point/dailyTask?type=1");
	if (data.code == 200 || data.code == -2) return true;
	if (!(param.name && param.pwd)) return false;
	return await open("https://music.163.com/#/login", /** 调试时设置成true */ false, async (fb) => {
		// 获取页面所有iframe
		let frames = await fb.iframes();
		console.log(frames.map((x) => x.url));
		for (let ifb of frames) {
			// 定位目标iframe,并模拟登录
			if (ifb.url == "https://music.163.com/login") {
				await ifb.click(`[data-action="switch"]`);
				await ifb.click("#j-official-terms");
				await ifb.click(`[data-action="login"]`);
				await fb.value(".j-phone.txt.u-txt", param.name);
				await fb.value(".j-pwd.u-txt", param.pwd);
				await fb.click(`.j-primary[data-action="login"]`);
				await fb.waitLoaded();
				return true;
			}
		}
		return false;
	});
};
