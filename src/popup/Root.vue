<template>
	<div class="root">
		<div class="tar">
			<a target="_blank" href="/pages/options.html">任务管理</a>
		</div>
		<label>
			<span>掉线通知频率(秒)</span>
			<input type="number" v-model="config.notify_freq">
		</label><br />
		<label>
			<span>失败重试频率(秒)</span>
			<input type="number" v-model="config.retry_freq">
		</label><br />
		<label>
			<span>任务循环频率(秒)</span>
			<input type="number" v-model="config.loop_freq">
		</label><br />
		<label>
			<span>签到开始时间(秒),默认8点整</span>
			<input type="number" v-model="config.begin_at">
		</label><br />
		<label>
			<span>自动更新脚本</span>
			<input type="checkbox" v-model="config.upgrade">
		</label><br />
		<label>
			<span>自动更新频率(秒),默认1天</span>
			<input type="number" v-model="config.upgrade_freq">
		</label><br />
		<label>
			<span>任务超时限制(秒),默认60秒</span>
			<input type="number" v-model="config.timeout">
		</label><br />
		<div class="tar">
			<button @click="save">保存</button>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import utils from '../common/client';

export default {
	data: function () {
		return {
			config: {}
		}
	},
	methods: {
		save() {
			utils.request('config/set', this.config)
		}
	},
	async mounted() {
		this.config = await utils.request('config/get')
	}
}
</script>
<style lang="less">
.root {
	min-width: 240px;
	input {
		margin-bottom: 3px;
	}
	input[type="number"] {
		width: 56px;
	}
}
</style>
