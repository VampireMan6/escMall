<template>
	<view class="button_style" :class="state?'b-1A8':'b-7FC'" @tap="btnClick">{{text}}</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: ""
			},
			state: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			btnClick() {
				this.$emit('btnClick')
			}
		}
	}
</script>

<style>
</style>
