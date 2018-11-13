let config = {
    notify_at: 0, // 通知时间
    notify_freq: 600, // 掉线通知频率(秒),默认10分钟
    retry_freq: 600, // 重试间隔时间(秒),默认10分钟
    loop_freq: 5, // 任务循环间隔时间(秒)
};

chrome.storage.local.get(config, function(data) {
    Object.assign(config, data);
});

export default config;