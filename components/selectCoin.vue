<template>
	<view class="p-10 b-b f-between j-center b-F9F b-r-15" @tap="select">
		<view class="j-center">
			<!-- <image v-if="coinImage" class="image-30 b-r-50" :src="coinImage" mode=""></image> -->
			<slot class="" name="image"></slot>
			<!-- <image v-else class="image-30 b-r-50 b-1A8" src="" mode=""></image> -->
			<text class="m-l-5 f-18 f-w-600">{{select_text}}</text>
		</view>
		<view class="j-center">
			<text class="c-CCC">切换币种</text>
			<image class="m-l-10" style="width: 32rpx;height: 32rpx;" src="../static/images/pro_12.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			select_text: {
				type: String,
				default: ""
			},
			coinImage: {
				type: String,
				default: ""
			}
		},
		methods: {
			select() {
				this.$emit('select')
			}
		}
	}
</script>

<style scoped>
	view {
		display: flex;
	}
</style>
