import axios from 'axios';
const ts = [
	[86400e3 * 365, "年"],
	[86400e3 * 30, "月"],
	[86400e3, "天"],
	[3600e3, "小时"],
	[60e3, "分钟"],
	[1e3, "秒"],
];
const isFirefox = /firefox/i.test(navigator.userAgent);
window.axios = axios;
let utils = {
	isFirefox,
	axios: axios.create({ timeout: 30e3 }),
	fromNow(v, digits, def) {
		digits = digits || 0;
		if (!v) return def || '未设置';
		if (typeof v === "number" && v < 1e12) {
			v *= 1e3;
		}
		v = new Date(v) - new Date();
		let s = utils.diff(Math.abs(v), digits, v > 0 ? '后' : '前');
		if (s) return s;
		return '现在';
	},
	diff(v, digits, suffix) {
		suffix = suffix || '';
		let s = '';
		for (let unit of ts) {
			let diff = v / unit[0];
			let tmp = Math.floor(diff);
			if (tmp) {
				if (digits) {
					let n = Math.pow(10, digits);
					s = Math.floor(v / unit[0] * n) / n;
				} else {
					s = tmp;
				}
				s += unit[1];
				break;
			}
		}
		if (s) return s + suffix;
	},
	/**
	 * 复制一个去掉keys的body对象
	 * @param {Object} body 
	 * @param {string[]|{}} keys 
	 */
	clearKeys(body, keys) {
		let data = {};
		if (keys instanceof Array) { // 清除keys中的字段
			Object.assign(data, body);
			for (let key of keys) {
				delete data[key];
			}
		} else { // 清除与keys值相同的字段
			for (let k in body) {
				let v = body[k];
				if (keys[k] != v)
					data[k] = v;
			}
		}
		return data;
	},
	/**
	 * @param {number} t 
	 * @param {string} format 
	 */
	format(t, format) {
		if (typeof t === "number" && t < 1e12) {
			t *= 1e3;
		}
		t = new Date(t);
		let Y = (t.getFullYear() + 1e4).toString().slice(1);
		return format.replace(/YYYY/g, Y)
			.replace(/YY/g, Y.slice(2))
			.replace(/MM/g, (t.getMonth() + 101).toString().slice(1))
			.replace(/DD/g, (t.getDate() + 100).toString().slice(1))
			.replace(/hh/g, (t.getHours() + 100).toString().slice(1))
			.replace(/mm/g, (t.getMinutes() + 100).toString().slice(1))
			.replace(/ss/g, (t.getSeconds() + 100).toString().slice(1));
	},
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	compileTask(text) {
		let beg = text.indexOf('==UserScript==');
		let end = text.indexOf('==/UserScript==');
		if (beg < 0 || end < 0 || beg > end) return;
		let task = { code: text };
		text = text.slice(beg + 14, end);
		text = text.replace(/\n\s*\/\/ ?/g, '\n');
		text = text.split(/\n\s*@/);
		text = text.map(x => x.trim()).filter(x => x);
		for (let line of text) {
			let name = /\w+\s*/.exec(line);
			if (name) {
				name = name[0];
				let value = line.slice(name.length).replace(new RegExp(Array.from({ length: name.length + 1 }).fill(' ').join(''), 'g'), '').trim();
				name = name.trim();
				let one = task[name];
				if (one) {
					let ones = task[name + 's'];
					if (ones) ones.push(value);
					else task[name + 's'] = [one, value];
				}
				task[name] = value;
			}
		}
		// console.log(task)
		if (!task) throw ('格式非法,找不到==UserScript==区域');
		if (!task.author) task.author = '';
		if (!task.name) throw ('缺少@name');
		if (!task.domain) throw ('缺少@domain');
		else if (!task.domains) task.domains = [task.domain];
		if (task.grant && !task.grants) task.grants = task.grant.split(',');
		if (task.param && !task.params) task.params = [task.param];
		if (task.params) {
			task._params = {};
			task.params = task.params.map(x => {
				let param = {};
				let ss = x.split(/\s+/);
				param.placeholder = param.label = param.name = ss[0];
				param.type = 'text';
				if (ss.length > 2) {
					param.label = ss.slice(2).join(' ');
					try {
						param.type = 'select';
						param.options = `[${ss[1]}]`;
					} catch (error) {
						param.type = ss[1];
					}
				} else if (ss.length == 2) {
					param.label = ss[1];
				}
				let ll = param.label.split(',');
				param.label = ll[0];
				if (ll.length > 1) param.placeholder = ll.slice(1).join(',');
				return param;
			});
		}
		delete task.param;
		delete task.domain;
		task.expire = +task.expire || 900e3; // 默认15分钟过期
		task.enable = false;
		return task;
	},
};

export default utils;