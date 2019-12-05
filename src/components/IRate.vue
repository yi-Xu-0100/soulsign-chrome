<template>
	<span class="nowrap" :style="sty">
		<slot></slot>
	</span>
</template>
<script>
import Vue from 'vue'

export default {
	props: {
		value: { type: Number, required: true },
		color: { type: String, default: '#4caf50' },
		bgColor: { type: String, default: '#9e9e9e' },
		textColor: { type: String, default: '#fff' },
		width: { type: [Number, String] },
	},
	computed: {
		sty() {
			return {
				background: `${this.bgColor} linear-gradient(${this.color},${this.color}) no-repeat`,
				backgroundSize: `${this.value * 100}% 100%`,
				color: this.textColor,
				width: this.width
			}
		}
	},
}
</script>