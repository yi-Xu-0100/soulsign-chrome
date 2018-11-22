import axios from 'axios';
import config from './config';
const ts = [
    [86400e3 * 365, "年"],
    [86400e3 * 30, "月"],
    [86400e3, "天"],
    [3600e3, "小时"],
    [60e3, "分钟"],
    [1e3, "秒"],
];
const isFirefox = /firefox/i.test(navigator.userAgent);

let utils = {
    isFirefox,
    axios: axios.create({ timeout: 30e3 }),
    syncValues(keys) {
        var data = {};
        for (let key of keys) {
            data[key] = {
                get() {
                    return this.init[key];
                },
                set(value) {
                    this.init[key] = value;
                    chrome.storage.local.set({
                        [key]: value
                    });
                }
            };
        }
        return data;
    },
    /**
     * 获取文件
     * @param {string} accept 'image/png'
     * @param {boolean} multiple 
     * @returns {Promise<File|FileList>}
     */
    pick(accept, multiple) {
        return new Promise((resolve, reject) => {
            let input = document.createElement('input');
            input.type = 'file';
            input.multiple = multiple;
            input.accept = accept || '*';
            input.onchange = function(e) {
                resolve(multiple ? e.target.files : e.target.files[0]);
            };
            input.click();
        });
    },
    readAsText(file) {
        return new Promise((resolve, reject) => {
            let fr = new FileReader();
            fr.readAsText(file);
            fr.onload = e => {
                resolve(e.target.result);
            };
        });
    },
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
    loading(name = 'loading') {
        return function(target, key, descriptor) {
            const method = descriptor.value;
            descriptor.value = function() {
                if (this[name]) return;
                this[name] = true;
                let ret = method.apply(this, arguments);
                if (ret && typeof ret.then === "function") {
                    return ret.then(data => {
                        this[name] = false;
                        return data;
                    }, err => {
                        this[name] = false;
                        return Promise.reject(err);
                    });
                }
                return ret;
            };
            return descriptor;
        };
    },
    TASK_EXT: {
        online_at: 0,
        run_at: 0,
        success_at: 0,
        failure_at: 0,
        result: '',
        enable: true,
        ok: 0,
        cnt: 0,
    },
    getTasks() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('tasks', ({ tasks }) => {
                resolve((tasks || []).map(task => {
                    let request = axios.create({ timeout: 10e3 });
                    request.interceptors.request.use(function(config) {
                        let m = /https?:\/\/([^:\/]+)/.exec(config.url);
                        if (!m || task.domains.indexOf(m[1])) return Promise.reject(`domain配置不正确`);
                        if (config.headers) {
                            if (config.headers['Referer']) {
                                config.headers['_referer'] = config.headers['Referer'];
                                delete config.headers['Referer'];
                            } else if (config.headers['referer']) {
                                config.headers['_referer'] = config.headers['referer'];
                                delete config.headers['referer'];
                            }
                        }
                        return config;
                    });
                    task = Object.assign({}, utils.TASK_EXT, task);
                    let module = { exports: task };
                    try {
                        new Function('exports', 'module', 'axios', task.code)(module.exports, module, request);
                    } catch (err) {
                        console.error(`脚本${task.author}/${task.name}错误`, err);
                    }
                    return task;
                }));
            });
        });
    },
    saveTasks(tasks) {
        return new Promise((resolve, reject) => {
            if (isFirefox) tasks = JSON.parse(JSON.stringify(tasks));
            chrome.storage.local.set({ tasks }, resolve);
        });
    },
    saveConfig() {
        return new Promise((resolve, reject) => {
            let tmp;
            if (isFirefox) tmp = JSON.parse(JSON.stringify(config));
            else tmp = config;
            chrome.storage.local.set(tmp, resolve);
        });
    },
    addTask(tasks, task) {
        for (let i = 0; i < tasks.length; i++) {
            let row = tasks[i];
            if (row.name == task.name && row.author == task.author) {
                task = Object.assign({}, task);
                for (let k in row) { // 复制原有变量
                    if (task[k] == null || utils.TASK_EXT[k] != null)
                        task[k] = row[k];
                }
                tasks.splice(i, 1, task);
                return;
            }
        }
        tasks.push(task);
    },
    async runTask(task) {
        let now = +new Date();
        task.run_at = now;
        task.cnt++;
        console.log(task.name, '开始签到');
        try {
            task.result = await task.run();
            task.success_at = now;
            task.ok++;
            console.log(task.name, '签到成功');
        } catch (err) {
            task.result = (err || '失败') + '';
            task.failure_at = now;
            console.error(task.name, '签到失败', err);
        }
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
        if (!task) throw ('格式非法,找不到==UserScript==区域');
        if (!task.author) task.author = '';
        if (!task.name) throw ('缺少@name');
        if (!task.domain) throw ('缺少@domain');
        else if (!task.domains) task.domains = [task.domain];
        task.expire = +task.expire || 900e3; // 默认15分钟过期
        task.enable = true;
        return task;
    },
};

export default utils;