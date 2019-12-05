declare module soulsign {
	interface Task<T> {
		online_at: number; // 最近在线时间
		run_at: number; // 上次执行时间
		success_at: number; // 上次执行成功时间
		failure_at: number; // 上次执行失败时间
		result: string; // 执行结果
		enable: boolean; // 是否启动
		ok: number; // 成功次数
		cnt: number; // 失败次数
		_params: T; // 参数
		author: string; // 作者
		code: string; // 代码
		domains: string[]; // 允许域名
		expire: number; // 检查在线的频率
		loginURL: string; // 登录链接
		name: string; // 脚本名
		namespace: string; // 主页
		updateURL: string; // 更新链接
		version: string; // 版本号
		grants: string[]; // 该脚本需要的权限
		run: (param?: T) => Promise<string>; // 签到函数
		check?: (param?: T) => Promise<boolean>; // 检查是否在线函数
	}
}
