interface FrameRunner {
	/** 初始url不会随页面跳转更新 */
	url: string;
	/** 执行脚本,运行在插件环境(仅返回可以序列化的对象) */
	eval(code: string): Promise<any>;
	/** 执行脚本,运行在插件环境(fn不能使用上下文中的变量,args仅支持可以序列化的对象,仅返回可以序列化的对象) */
	eval(fn: Function, ...args): Promise<any>;
	/** 在浏览器环境执行脚本 */
	inject(code: string): Promise<void>;
	/** 在浏览器环境执行脚本(fn不能使用上下文中的变量,args仅支持可以序列化的对象) */
	inject(fn: Function, ...args): Promise<void>;
	/** 等待元素出现, 每次重试间隔1秒 */
	waitUntil(selector: string, retryCount = 10): Promise<boolean>;
	/** 等待页面跳转结束 */
	waitLoaded(timeout?: number): Promise<boolean>;
	/** 点击元素, 如果元素不存在则waitUntil */
	click(selector: string, retryCount = 10): Promise<boolean>;
	/** 设置元素value, 如果元素不存在则waitUntil */
	value(selector: string, value: string, retryCount = 10): Promise<boolean>;
	/** 获取页面的所有iframe页面 */
	iframes(): Promise<FrameRunner[]>;
}
/** 在MacOS上相当于openWindow， 其它平台相当于openTab */
declare function open<T>(url: string, devMode: boolean, cb: (fb: FrameRunner) => Promise<T>, preload: string): Promise<T>;
/**
 * 使用tab方式打开页面, 对window系统友好(不会在任务栏突然多一个任务),
 * 当devMode为false时tab不会激活，这个可以被目标网页检测到，可能导致签到失败。
 * @param url
 * @param devMode 是否开发模式(窗口会显示出来,否则窗口会隐藏)
 * @param cb 回调，返回promise,promise结束后窗口会关闭
 * @param preload 预执行脚本,运行在浏览器环境,在页面js执行之前执行，可以进行一些hack行为
 */
declare function openTab<T>(url: string, devMode: boolean, cb: (fb: FrameRunner) => Promise<T>, preload: string): Promise<T>;
/**
 * 使用新窗口打开页面, 对于macos系统友好(用户完全无感)
 * @param url
 * @param devMode 是否开发模式(窗口会显示出来,否则窗口会隐藏)
 * @param cb 回调，返回promise,promise结束后窗口会关闭
 * @param preload 预执行脚本,运行在浏览器环境,在页面js执行之前执行，可以进行一些hack行为
 */
declare function openWindow<T>(url: string, devMode: boolean, cb: (fb: FrameRunner) => Promise<T>, preload: string): Promise<T>;
declare namespace tools {
	declare function version(ver: string, extVer?: string): 0 | -1 | 1;
	declare function sleep(ms: number): Promise<void>;
}
