<template>
	<mu-dialog title="细节/日志" v-loading="loading" :open="Boolean(open)" @update:open="close" class="pages-details" scrollable>
		<mu-sub-header>脚本名称</mu-sub-header>
        <mu-list-item-content>
			<mu-list-item-title>{{task.name}}</mu-list-item-title>
        </mu-list-item-content>
		<div v-if="task.result.list">
			<mu-divider></mu-divider>
			<mu-sub-header>域名列表</mu-sub-header>
			<mu-data-table stripe height="300" :columns="columns" :data="task.result.list">
				<template slot-scope="scope">
					<td>
						<mu-avatar :size="20">
						<img :src="'chrome://favicon/'+scope.row.url">
						</mu-avatar>
					</td>
					<td>
						{{scope.row.domain}}
					</td>
					<td>
						<a :href="scope.row.url" target="_blank">
							<span class="btn" :class="!scope.row.errno?'green':'red'">
								{{scope.row.message}}
							</span>
						</a>
					</td>
				</template>
			</mu-data-table>
		</div>
		<mu-divider></mu-divider>
        <mu-sub-header>日志</mu-sub-header>
		<mu-tabs :value.sync="active" inverse color="secondary" text-color="rgba(0, 0, 0, .54)"  center>
    		<mu-tooltip :placement="'top'" content="export.run().return">
				<mu-tab>源</mu-tab>
    		</mu-tooltip>
    		<mu-tooltip :placement="'top'" content="export.run().return.summary">
				<mu-tab>概述</mu-tab>
    		</mu-tooltip>
    		<mu-tooltip :placement="'top'" content="export.run().return.detail">
				<mu-tab>详情</mu-tab>
    		</mu-tooltip>
    		<mu-tooltip :placement="'top'" content="export.run().return.list">
				<mu-tab>域名列表</mu-tab>
    		</mu-tooltip>
		</mu-tabs>
		<div class="result-plain" v-if="active === 0">
			{{task.result}}
		</div>
		<div class="result-summary" v-if="active === 1">
			{{task.result.summary}}
		</div>
		<div class="result-detail" v-if="active === 2">
			{{task.result.detail}}
		</div>
		<div class="result-list" v-if="active === 3">
			{{task.result.list}}
		</div>
	</mu-dialog>
</template>
<script>
export default {
	props: {
		open: {},
		task: {},
	},
	data() {
		return {
      		active: 0,
			loading: false,
			sort: {
				name: '',
				order: 'asc'
			},
			columns: [
				{ title: '图标', name: 'ico', width: 20, align: 'center' },
				{ title: '域名', name: 'domain', width: 100, align: 'center' },
				{ title: '消息', name: 'message', width: 200, align: 'center' },
			]
		}
	},
	watch: {
		open() {
			this.refresh()
		}
	},
	methods: {
		async refresh() {
			if (!this.open) return
			this.$with(async () => {
				try {
				} catch (error) {
					this.$toast.error(error + '')
					this.close()
				}
			})
		},
		close() {
			location.href = '#'
			this.$emit('update:open', false)
		},
	},
	mounted() {
		if (this.open) this.refresh()
	}
}
</script>
<style lang="less">
.pages-details {
	.mu-sub-header {
		padding-left: initial;
	}
    .mu-dialog {    
		width: 800px;
    	max-width: 75%;
    	font-size: initial;
	}
	table.mu-table-header,
    table.mu-table-body {
        width: -webkit-fill-available!important;
    }
}
</style>
