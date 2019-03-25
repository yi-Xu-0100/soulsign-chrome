import config from '../common/config';
import utils from '../common/utils';
import dayjs from 'dayjs';

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        var storageChange = changes[key];
        config[key] = storageChange.newValue;
    }
});

function race(pms, ms) {
    return Promise.race([utils.sleep(ms || (config.timeout * 1e3)), pms]);
}

async function loop() {
    let tasks = await utils.getTasks();
    let today = dayjs().add(-config.begin_at, 'second').startOf('day').add(config.begin_at, 'second');
    let changed = false;
    for (let task of tasks) {
        if (!task.enable) continue;
        if (task.check) { // 有检查是否在线的函数
            let now = +new Date();
            if (task.online_at + task.expire < now) { // 没有检查过|之前不在线|到了再次检查时间了
                changed = true;
                let ok = false;
                try {
                    console.log(task.name, '开始检查是否在线');
                    ok = await race(task.check(task._params));
                } catch (err) {
                    if (/Network Error|timeout/.test(err)) return; // 网络中断载时
                    console.log(task.name, '开始检查是否在线失败', err);
                }
                if (!ok) { // 不在线，直接跳过
                    console.log(task.name, '不在线');
                    if (config.notify_at + config.notify_freq * 1e3 < now) {
                        // 距离上次不在线15分钟了
                        new Notification(`${task.name}不在线`, {
                            body: '点此去登录或禁用它',
                            icon: `https://www.google.com/s2/favicons?domain=${task.domains[0]}`,
                        }).onclick = function() {
                            chrome.tabs.create({ url: task.loginURL || '/pages/options.html' });
                        };
                        config.notify_at = now;
                        await utils.saveConfig();
                    }
                    task.online_at = -now;
                    continue;
                }
                console.log(task.name, '在线');
                task.online_at = now;
            }
        }
        if (dayjs(task.success_at).isBefore(today)) {
            // 今天没有执行成功过
            if (task.failure_at + config.retry_freq * 1e3 > new Date().getTime()) // 运行失败后要歇10分钟
                continue;
            changed = true;
            await race(utils.runTask(task));
        }
    }
    if (changed) await utils.saveTasks(tasks);
}

async function upgrade() {
    let now = +new Date();
    if (config.upgrade_at + (config.upgrade_freq * 1e3) > now) return;
    console.log('开始检查更新');
    let tasks = await utils.getTasks();
    let li = [];
    for (let task of tasks) {
        if (!task.enable) continue;
        if (task.updateURL) {
            try {
                let { data } = await utils.axios.get(task.updateURL);
                let item = utils.compileTask(data);
                if (item.version != task.version) {
                    li.push(task.name);
                    utils.addTask(tasks, item);
                }
            } catch (error) {
                console.error(task.name, '更新失败');
            }
        }
    }
    if (li.length) {
        await utils.saveTasks(tasks);
        let title = li[0];
        if (li.length > 1) title += `等${li.length}个脚本`;
        new Notification(title + ' 升级成功').onclick = () => chrome.tabs.create({ url: '/pages/options.html' });
    }
    config.upgrade_at = now;
    await utils.saveConfig();
}

let originMap = {};

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    let requestHeaders = details.requestHeaders;
    for (var i = 0; i < requestHeaders.length; ++i) {
        var header = requestHeaders[i];
        if (header.name === 'Origin') {
            if (!details.url.startsWith(header.value)) {
                originMap[details.requestId] = header.value;
            }
        }
    }
    // 只有插件才加
    if (!details.initiator || !details.initiator.startsWith('chrome-extension://')) return;
    for (var i = 0; i < requestHeaders.length; ++i) {
        var header = requestHeaders[i];
        if (header.name === '_referer') {
            requestHeaders.splice(i, 1, { name: 'Referer', value: header.value });
            return { requestHeaders };
        }
        if (header.name === '_origin') {
            requestHeaders.splice(i, 1, { name: 'Origin', value: header.value });
            return { requestHeaders };
        }
    }
}, { urls: ["<all_urls>"], types: ['xmlhttprequest'] }, ["blocking", "requestHeaders", "extraHeaders"]);

chrome.webRequest.onHeadersReceived.addListener(function(details) {
    if (!config.cross) return;
    let origin = originMap[details.requestId];
    if (origin) {
        delete originMap[details.requestId];
        // 只有跨域了才加
        let flag = config.allow_cross[details.initiator];
        if (!flag) return; // 不允许跨域
        let responseHeaders = details.responseHeaders;
        for (var i = 0; i < responseHeaders.length; ++i) {
            if (responseHeaders[i].name.toLowerCase() === 'access-control-allow-origin') {
                // 已经有了就不加了
                return;
            }
        }
        responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: origin });
        if (flag & 2) responseHeaders.push({ name: 'Access-Control-Allow-Credentials', value: 'true' });
        responseHeaders.push({ name: 'Access-Control-Allow-Headers', value: config.cross_header });
        return { responseHeaders };
    }
}, { urls: ["<all_urls>"], types: ['xmlhttprequest'] }, ["blocking", "responseHeaders"]);

async function main() {
    while (true) {
        if (config.lock < new Date().getTime()) { // 没有被锁定
            try {
                await loop();
                if (config.upgrade) await upgrade();
            } catch (error) {
                console.error(error);
            }
        }
        await utils.sleep(config.loop_freq * 1e3);
    }
}

main().catch(err => {
    console.log(`崩溃`, err);
});