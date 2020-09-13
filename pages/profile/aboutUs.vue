<template>
	<view class="container p-16 b-b">
		<view class="column j-center" style="margin: 80rpx 0 50rpx;">
			<image style="width: 180rpx;height: 180rpx;" class="m-b-10 b-r-5" src="../../static/images/app_logo0.jpg" mode=""></image>
			<text class="f-w-600 f-18">科恩存储</text>
		</view>
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getAboutus();
		},
		data() {
			return {
				text: ""
			}
		},
		methods: {
			async getAboutus() {
				let res = await this.$myRequest({
					url: 'aboutus'
				});
				if(res.data.code == 200) {
					this.text = res.data.data;
				}
			},
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		
	}
</style>
