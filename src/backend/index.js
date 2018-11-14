import config from '../common/config';
import utils from '../common/utils';
import dayjs from 'dayjs';

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        var storageChange = changes[key];
        config[key] = storageChange.newValue;
    }
});

async function loop() {
    let tasks = await utils.getTasks();
    let today = dayjs().startOf('day');
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
                    ok = await task.check();
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
                            chrome.tabs.create({ url: '/pages/options.html' });
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
        if (dayjs(task.success_at + (config.begin_at % 86400 * 1e3)).isBefore(today)) {
            // 今天没有执行成功过
            if (task.failure_at + config.retry_freq * 1e3 > new Date().getTime()) // 运行失败后要歇10分钟
                continue;
            changed = true;
            await utils.runTask(task);
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
            let { data } = await utils.axios.get(task.updateURL);
            try {
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

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    // 只有插件才加
    if (!details.initiator.startsWith('chrome-extension://')) return;
    let requestHeaders = details.requestHeaders;
    for (var i = 0; i < requestHeaders.length; ++i) {
        var header = requestHeaders[i];
        if (header.name === '_referer') {
            requestHeaders.splice(i, 1, { name: 'Referer', value: header.value });
            return { requestHeaders };
        }
    }
}, { urls: ["<all_urls>"], types: ['xmlhttprequest'] }, ["blocking", "requestHeaders"]);

async function main() {
    while (true) {
        await loop();
        if (config.upgrade) await upgrade();
        await utils.sleep(config.loop_freq * 1e3);
    }
}

main();