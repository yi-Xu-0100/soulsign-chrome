// ==UserScript==
// @name              京东APP签到+翻牌
// @namespace         https://github.com/inu1255/soulsign-chrome
// @version           1.0.0
// @author            inu1255
// @loginURL          http://vip.jd.com/
// @updateURL         https://gitee.com/inu1255/soulsign-chrome/raw/master/public/demos/m.jd.js
// @expire            900e3
// @domain            api.m.jd.com
// @param             name 账号
// @param             pwd 密码
// ==/UserScript==

exports.run = async function(param) {
    var { data } = await axios.get('https://api.m.jd.com/client.action?functionId=signBeanStart&body=%7B%7D&client=ld&clientVersion=1.0.0');
    var { data } = await axios.get('https://api.m.jd.com/client.action?functionId=getCardResult&body=%7B%22index%22%3A1%7D&client=ld&clientVersion=1.0.0');
    if (data.code == 0) return data.errorMessage || '签到成功';
    throw data.errorMessage;
};

exports.check = async function(param) {
    var { data } = await axios.get('https://api.m.jd.com/client.action?functionId=signBeanStart&body=%7B%7D&client=ld&clientVersion=1.0.0');
    if (data.code == 0) {
        param.opened = false;
        return true;
    }
    if (!param.pwd || !param.name) return false;
    if (param.opened) return false;
    param.opened = true;
    chrome.tabs.create({ url: `http://vip.jd.com/` }, async (tab) => {
        console.log('tabid', tab.id);
        let url = await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'location.href' }, x => resolve(x && x[0])));
        let timeout = +new Date() + 600e3;
        while (!url || !/passport.jd.com/.test(url) && timeout > new Date()) {
            if (!/vip.jd.com/.test(url)) await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'location.href="http://vip.jd.com/"' }, x => resolve(x)));
            await new Promise(resolve => setTimeout(resolve, 1e3));
            url = await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'location.href' }, x => resolve(x && x[0])));
        }
        while (url && /passport.jd.com/.test(url) && timeout > new Date()) {
            await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'document.querySelector(".login-tab-r").click()' }, x => resolve(x)));
            await new Promise(resolve => setTimeout(resolve, 1e3));
            await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'document.querySelector("#loginname").value="' + param.name + '"' }, x => resolve(x)));
            await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'document.querySelector("#nloginpwd").value="' + param.pwd + '"' }, x => resolve(x)));
            await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'document.querySelector("#loginsubmit").click()' }, x => resolve(x)));
            url = await new Promise(resolve => chrome.tabs.executeScript(tab.id, { code: 'location.href' }, x => resolve(x && x[0])));
        }
        chrome.tabs.remove(tab.id);
    });
};