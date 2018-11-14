<template>
	<div class="root">
		<div class="tar">
			<a target="_blank" href="/pages/options.html">任务管理</a>
		</div>
		<label>
			<span>掉线通知频率(秒)</span>
			<input type="number" v-model="config.notify_freq">
		</label>
		<label>
			<span>失败重试频率(秒)</span>
			<input type="number" v-model="config.retry_freq">
		</label>
		<label>
			<span>任务循环频率(秒)</span>
			<input type="number" v-model="config.loop_freq">
		</label>
		<label>
			<span>签到开始时间(秒),默认8点整</span>
			<input type="number" v-model="config.begin_at">
		</label>
		<div class="tar">
			<button @click="save">保存</button>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator';
import utils from '../common/utils';
import config from '../common/config'

@Component()
export default class Root extends Vue {
	config = config
	save() {
		utils.saveConfig()
	}
	mounted() {
		chrome.storage.onChanged.addListener(changes => {
			for (let key in changes) {
				var storageChange = changes[key];
				this.config[key] = storageChange.newValue;
			}
		});
	}
}
</script>
<style lang="less">
.root {
  input {
    margin-bottom: 3px;
  }
}
</style>
