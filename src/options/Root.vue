<template>
	<div class="root">
		<mu-appbar color="primary">
			<div @click="go('#')" class="mu-appbar-title">魂签</div>
			<mu-button @click="go('#cross')" flat slot="right">跨域管理</mu-button>
			<mu-button @click="go('#')" flat slot="right">脚本管理</mu-button>
			<mu-button @click="more=true" flat slot="right">脚本推荐</mu-button>
			<mu-button @click="go('https://perpay.inu1255.cn/donate/4?page=1&n=1',1)" flat slot="right">捐赠</mu-button>
			<mu-button @click="go('https://github.com/inu1255/soulsign-chrome',1)" flat slot="right">源码</mu-button>
		</mu-appbar>
		<br>
		<Cross v-if="path=='cross'"></Cross>
		<mu-container v-else style="margin-bottom: 245px;">
			<div class="tar">
				<mu-button @click="clear()" color="primary">清空计数</mu-button>
				<mu-button @click="edit()" color="primary">添加脚本</mu-button>
				<!-- <mu-button @click="refresh">刷新</mu-button> -->
			</div>
			<br>
			<mu-data-table :sort.sync="sort" :columns="columns" :data="list" stripe :hover="false">
				<template slot-scope="{row,$index}">
					<td>{{row.author}}</td>
					<td>
						<a class="app" v-if="row.namespace" :href="row.namespace" target="_blank">{{row.name}}</a>
						<span v-else>{{row.name}}</span>
						<a v-if="row.updateURL" class="nowrap" :href="'#'+row.updateURL">更新/重装</a>
					</td>
					<td>{{row.version}}</td>
					<td>
						<span v-for="domain in row.domains" :key="domain" :title="domain">
							<img :src="'https://www.google.com/s2/favicons?domain='+domain" :alt="domain">
						</span>
					</td>
					<td>
						<a target="_blank" :href="row.loginURL" v-if="row.loginURL&&row.online_at<0">不在线</a>
						<i-date v-else-if="row.online_at>0" :value="row.online_at"></i-date>
						<span v-else>未检查</span>
					</td>
					<td>
						<i-date :value="row.run_at"></i-date>
					</td>
					<td>
						<span v-if="row.cnt" title="查看日志(暂未实现)" class="btn" :class="row.success_at>row.failure_at?'green':'red'">
							{{row.result}}
						</span>
					</td>
					<td>
						<i-rate v-if="row.cnt" class="tac" width="72px" :value="row.ok/row.cnt||0">{{row.ok}}/{{row.cnt}}</i-rate>
						<span v-else>未执行</span>
					</td>
					<td>
						<mu-switch :input-value="row.enable" @change="toggle(row)"></mu-switch>
					</td>
					<td>
						<mu-button v-if="row.params" @click="set(row,$index)" title="配置参数" icon small>
							<mu-icon value="settings"></mu-icon>
						</mu-button>
						<mu-button @click="run(row)" title="立即执行" icon small :disabled="running">
							<mu-icon value="play_arrow"></mu-icon>
						</mu-button>
						<mu-button @click="edit(row)" title="编辑" icon small>
							<mu-icon value="edit"></mu-icon>
						</mu-button>
						<mu-button @click="del(row)" title="删除" icon small>
							<mu-icon value="delete"></mu-icon>
						</mu-button>
					</td>
				</template>
			</mu-data-table>
		</mu-container>
		<mu-dialog :width="480" :open="Boolean(body)" @update:open="body=false">
			<div class="tar">
				<mu-button @click="pick" color="primary">上传文件</mu-button>
			</div>
			<mu-text-field style="margin:16px 0 0 0;" v-model="body.code" full-width multi-line :rows="10" :rows-max="10" placeholder="在这里粘贴代码 或 拖拽脚本文件到这里 或 粘贴脚本URL" @dragover.prevent="()=>0" @drop="drop" @paste="paste"></mu-text-field>
			<mu-button slot="actions" flat @click="body=false">取消</mu-button>
			<mu-button slot="actions" flat color="primary" @click="onAdd">确定</mu-button>
		</mu-dialog>
		<div v-show="log" class="console">
			<mu-container>
				<div class="title">
					<span class="h3">{{log.author}}/{{log.name}} - 日志</span>
					<mu-icon class="btn fr" value="close" @click="log=false" :size="16"></mu-icon>
				</div>
				<mu-divider></mu-divider>
				<ul class="scrollY">
					<li v-for="(line,i) in log.logs" :key="i">
						<span class="small">{{line.time|format('YYYY-MM-DD hh:mm:ss')}}</span>
						<span :class="line.type||'info'">{{line.text}}</span>
					</li>
				</ul>
			</mu-container>
		</div>
		<i-form :open.sync="settingTask._params" :title="settingTask.name" :params="settingTask.params" :submit="setting"></i-form>
		<Preview :open.sync="url" @submit="add"></Preview>
		<Lists :open.sync="more"></Lists>
	</div>
</template>
<script>
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator';
import utils from '../common/utils.js'
import Cross from './pages/Cross.vue'
import Preview from './pages/Preview.vue'
import Lists from './pages/Lists.vue'

@Component({ components: { Preview, Lists, Cross } })
export default class Root extends Vue {
	loading = false
	log = false // 当前查看log的任务
	body = false // 添加/编辑脚本
	running = false
	tasks = []
	sort = { name: 'name', order: 'asc' }
	url = false // 导入url
	more = false // 插件推荐
	path = ''
	settingTask = {
		name: '',
		_params: false,
		params: [],
	}
	get columns() {
		return [{
			title: "作者",
			name: 'author',
			width: 96,
			sortable: true,
		}, {
			title: "脚本名",
			name: 'name',
			sortable: true,
		}, {
			title: "版本",
			name: 'version',
			width: 64,
			sortable: true,
		}, {
			title: '站点',
			name: 'domains',
			width: 72,
			sortable: true,
		}, {
			title: '是否在线',
			name: 'online_at',
			width: 96,
			sortable: true,
		}, {
			title: '最近执行时间',
			name: 'run_at',
			width: 96,
			sortable: true,
		}, {
			title: '执行结果',
			name: 'result',
			sortable: true,
		}, {
			title: '成功次数',
			name: 'ok',
			width: 96,
			sortable: true,
		}, {
			title: "已启用",
			name: 'enable',
			width: 62,
			sortable: true,
		}, {
			title: '操作',
			width: 168,
		}]
	}
	get list() {
		this.update_at = +new Date()
		let tasks = this.tasks
		let name = this.sort.name
		let o = this.sort.order == 'asc' ? 1 : -1
		if (name == 'domains') {
			tasks.sort((a, b) => {
				var v = a.domains.length - b.domains.length
				if (v) return o * v
				return o * (a.domains[0] >= b.domains[0] ? 1 : -1)
			})
		} else if (name == 'result') {
			tasks.sort((a, b) => {
				return o * ((a.success_at - a.failure_at) - (b.success_at - b.failure_at))
			})
		} else if (["author", "name", "version",].indexOf(name) >= 0) {
			tasks.sort((a, b) => {
				return o * (a[name] >= b[name] ? 1 : -1)
			})
		} else {
			tasks.sort((a, b) => {
				return o * (a[name] - b[name])
			})
		}
		return tasks
	}
	@Watch('settingTask._params')
	onLock(val) {
		if (val) this.lockTasks()
		else this.unlockTasks()
	}
	async refresh() {
		this.tasks = await utils.getTasks()
	}
	async setting(body) {
		let task = this.settingTask.task //this.tasks[this.settingTask.i]
		Object.assign(task._params, body)
		await utils.addTask(this.tasks, task)
		await utils.saveTasks(this.tasks)
		this.$toast.success(`${this.settingTask.name} 保存成功`)
		this.settingTask._params = false
	}
	set(task, i) {
		let { name, _params, params } = task
		this.settingTask = { name, _params, params, task }
	}
	@utils.loading('running')
	async run(row) {
		let prev = row.success_at
		this.$toast.message(`${row.name} 开始执行`)
		await utils.runTask(row)
		await utils.saveTasks(this.tasks)
		if (row.success_at == prev)
			this.$toast.error(`${row.name} 执行失败`)
		else
			this.$toast.success(`${row.name} 执行成功`)
	}
	clear() {
		for (let task of this.tasks) {
			task.ok = 0
			task.cnt = 0
		}
		return utils.saveTasks(this.tasks)
	}
	edit(row) {
		let body = Object.assign({ code: '' }, row)
		this.body = body
	}
	del(row) {
		let idx = this.tasks.indexOf(row)
		if (idx >= 0) {
			this.tasks.splice(idx, 1)
			utils.saveTasks(this.tasks)
		}
	}
	add(task) {
		if (this.url) {
			this.url = false
			location.href = '#'
		}
		let module = { exports: task }
		try {
			new Function('exports', 'module', 'axios', task.code)(module.exports, module, utils.axios)
		} catch (err) {
			console.error(err);
			return this.$toast.error('脚本错误')
		}
		if (typeof task.run != 'function') return this.$toast.error('缺少函数exports.run')
		utils.addTask(this.tasks, task)
		utils.saveTasks(this.tasks)
		this.body = false
		this.$toast.success('添加/修改成功')
	}
	onAdd() {
		try {
			let task = utils.compileTask(this.body.code)
			this.add(task)
		} catch (error) {
			this.$toast.error(error + '')
		}
	}
	toggle(row) {
		row.enable = !row.enable
		utils.saveTasks(this.tasks)
	}
	async pick() {
		let file = await utils.pick()
		this.body.code = await utils.readAsText(file)
	}
	async drop(e) {
		let files = e.dataTransfer.files;
		if (files.length > 0) {
			e.preventDefault();
			this.body.code = await utils.readAsText(files[0])
			return;
		}
	}
	async paste(e) {
		let isEmpty = this.body.code.trim().length == 0
		if (e.clipboardData.items) {
			var items = e.clipboardData.items;
			for (var i = 0; i < items.length; ++i) {
				var item = items[i];
				if (isEmpty && item.kind == "string" && item.type == "text/plain") {
					item.getAsString(r => {
						if (/^https?:\/\//.test(r)) {
							utils.axios.get(r).then(({ data }) => {
								document.execCommand('undo')
								this.body.code = data
							})
						}
					});
				}
			}
		}
	}
	go(url, flag) {
		if (flag) window.open(url)
		else location.href = url
	}
	created() {
		this.refresh()
	}
	lockTasks() {
		this.lock = true
		this.$root.lock = new Date().getTime() + this.$root.loop_freq * 1e3 * 2
	}
	unlockTasks() {
		this.lock = false
		this.$root.lock = 0
	}
	onHashChange() {
		let hash = location.hash.slice(1)
		if (hash == 'cross') this.path = 'cross'
		else this.path = ''
		if (/^https?:\/\//.test(hash)) this.url = hash
	}
	mounted() {
		chrome.storage.onChanged.addListener(({ tasks }) => {
			if (tasks && this.update_at > 5e3) {
				this.refresh()
			}
		})
		window.addEventListener('hashchange', this.onHashChange)
		this.onHashChange()
		setInterval(() => {
			if (this.lock) this.lockTasks()
		}, this.$root.loop_freq * 1e3);
	}
}
</script>
<style lang="less">
.root {
	a.app {
		color: #000;
		text-decoration: underline;
	}
	td img {
		height: 20px;
		margin: 0 1px;
	}
	.console {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 240px;
		background: #eee;
		border-top: 1px solid #555;
		ul {
			padding: 0;
			margin: 0;
			height: 216px;
		}
		li {
			list-style: none;
			.small {
				color: #aaa;
			}
			> .info {
				color: #00c853;
			}
			> .error {
				color: #f44336;
			}
			> .warning {
				color: #ffeb3b;
			}
		}
	}
}
</style>
