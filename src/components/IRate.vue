<template>
	<span class="nowrap" :style="sty">
		<slot></slot>
	</span>
</template>
<script>
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component()
export default class IRate extends Vue {
	@Prop({ type: Number, required: true }) value
	@Prop({ type: String, default: '#4caf50' }) color
	@Prop({ type: String, default: '#9e9e9e' }) bgColor
	@Prop({ type: String, default: '#fff' }) textColor
	@Prop({ type: [Number, String] }) width

	get sty() {
		return {
			background: `${this.bgColor} linear-gradient(${this.color},${this.color}) no-repeat`,
			backgroundSize: `${this.value * 100}% 100%`,
			color: this.textColor,
			width: this.width
		}
	}
}
</script>