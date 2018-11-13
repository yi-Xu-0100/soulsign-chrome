<template>
	<span :title="tip" class="nowrap" :class="cls">{{value|fromNow(digits)}}</span>
</template>
<script>
import filter from './filter.js'

export default {
	name: "IDate",
	props: {
		color: { type: Boolean },
		digits: { type: Number, default: 0 },
		value: {},
	},
	computed: {
		cls() {
			let cls = {}
			if (this.color) {
				if (new Date().getTime() > this.value) cls.red = true
				else cls.green = true
			}
			return cls
		},
		tip() {
			if (this.value)
				return filter.format(this.value, 'YYYY-MM-DD hh:mm')
			return ''
		}
	}
}
</script>