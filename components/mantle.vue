<template>
	<view class="fixed mantle" @touchmove.stop.prevent="moveHandle" @tap.stop="cancel">
		<slot name="pop"></slot>
	</view>
</template>

<script>
	export default {
		methods: {
			cancel() {
				this.$emit("cancel")
			},
			moveHandle() {
				
			}
		}
	}
</script>

<style scoped>
	.mantle {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 666;
		background-color: #000000;
	}
</style>
