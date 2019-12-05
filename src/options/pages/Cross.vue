<template>
	<mu-container class="pages-cross" style="margin-bottom: 245px;max-width: 640px;">
		<pre>加入白名单的站点可以跨域访问任何其它网址</pre>
		<br>
		<mu-text-field label="跨域头" v-model="cross_header" @change="saveCrose" full-width placeholder="Access-Control-Allow-Headers"></mu-text-field>
		<div class="tar">
			<mu-text-field v-model="site" placeholder="站点(协义://域名:[端口])"></mu-text-field>
			<mu-button @click="add" color="primary">添加</mu-button>
		</div>
		<mu-data-table :columns="columns" :data="cross_list" stripe>
			<template slot-scope="{row,$index}">
				<td>{{row.site}}</td>
				<td>
					<mu-switch :input-value="Boolean(row.cookie)" @change="saveCrose(row.cookie=row.cookie?0:2)"></mu-switch>
				</td>
				<td>
					<mu-switch :input-value="Boolean(row.enable)" @change="saveCrose(row.enable=row.enable?0:1)"></mu-switch>
				</td>
				<td>
					<mu-button small @click="del($index)" color="error">删除</mu-button>
				</td>
			</template>
		</mu-data-table>
	</mu-container>
</template>
<script>
import Vue from 'vue'
import utils from '../../common/client';

export default {
	data: function () {
		return {
			cross_header: '',
			cross_list: [],
			site: '',
			columns: [{
				title: '站点(协义://域名:[端口])',
			}, {
				title: 'cookie跨域',
				width: 128,
			}, {
				title: '启用',
				width: 62,
			}, {
				title: '操作',
				width: 128,
			}]
		}
	},
	methods: {
		add() {
			let host = /[^:]+:\/\/[^/]+/.exec(this.site);
			if (!host) return this.$toast.error('站点格式错误')
			host = host[0]
			for (let item of this.cross_list) {
				if (item.site == host)
					return this.$toast.error('站点已存在')
			}
			this.cross_list.push({
				site: host,
				enable: 1,
				cookie: 0,
			})
			this.saveCrose();
			this.$toast.success('添加成功')
		},
		del(i) {
			this.cross_list.splice(i, 1)
			this.saveCrose();
		},
		async getCrossList() {
			let config = await utils.request('config/get')
			let allow_cross = config.allow_cross
			let list = []
			for (let k in allow_cross) {
				let v = allow_cross[k]
				list.push({
					site: k,
					enable: v & 1,
					cookie: v & 2,
				})
			}
			this.cross_header = config.cross_header;
			this.cross_list = list
		},
		saveCrose() {
			let cross_header = this.cross_header;
			let allow_cross = {}
			for (let item of this.cross_list) {
				allow_cross[item.site] = item.enable | item.cookie
			}
			return utils.request('config/set', { allow_cross, cross_header })
		},
	},
	async mounted() {
		this.getCrossList()
		this.$forceUpdate()
	}
}
</script>
<style lang="less">
.pages-cross {
}
</style>
