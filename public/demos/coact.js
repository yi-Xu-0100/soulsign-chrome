// ==UserScript==
// @name              coact通知
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          https://ext.gaomuxuexi.com:4430/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/coact.js
// @expire            300e3
// @domain            ext.gaomuxuexi.com
// ==/UserScript==

exports.run = async function() {
    return this.check();
};

exports.check = async function() {
    if (!this._uid) { // 获取用户ID
        this._uid = await new Promise((resolve, reject) => {
            chrome.tabs.create({ url: 'https://ext.gaomuxuexi.com:4430' }, tab => {
                chrome.tabs.executeScript(tab.id, { code: 'localStorage.user_inf' }, ret => {
                    if (ret[0]) {
                        ret = JSON.parse(ret[0]);
                        resolve(ret.id);
                    }
                    chrome.tabs.remove(tab.id);
                });
            });
        });
    }
    let TIMES = ["iTChg", "iTCreate", "iTRe", "tCall"];
    let now = +new Date();
    var { data } = await axios.post("https://ext.gaomuxuexi.com:4430/inf_qry", {
        UIDDO: `[${this._uid}]`,
        RateMax: 99,
        sp: { "t": "Plan", "sp": 0, "dt": now },
    });
    if (data.no == 401) return; // cookie失效
    if (data.no != 200) {
        this._uid = 0;
        return;
    }
    let tasks = [];
    for (let row of data.inf) {
        for (let key of TIMES) {
            if (row.tOpen < row[key]) {
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
                tasks.push(`[关注]${row.iTit}`);
                break;
            }
        }
    }
    if (tasks.length) {
        new Notification('coact通知', {
            body: tasks.join(' '),
            icon: 'https://ext.gaomuxuexi.com:4430/favicon.ico'
        }).onclick = function() {
            chrome.tabs.create({ url: 'https://ext.gaomuxuexi.com:4430' });
        };
    }
    return true;
};