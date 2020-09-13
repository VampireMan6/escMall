<template>
	<view class="container">
		<view class="column">
			<text class="f-w-600 m-b-5">{{text}}</text>
			<view class="j-center input b-F9F b-r-10 p-x-10 b-b" :class="account?'border_2':'border_1'">
				<slot name="input"></slot>
				<view v-if="account" class="j-center">
					<image  class="image-15" src="../static/images/pro_17.png" mode="" @tap="delect"></image>
					<slot name="pass"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			account: {
				type: String,
				default: ''
			}
		},
		methods: {
			delect() {
				this.$emit('delect')
			}
		}
	}
</script>

<style lang="scss" scoped>
	view {
		display: flex;
	}
	.container {
		.input {
			height: 96rpx;
		}
		.border_1 {
			border: 2upx solid #F9F9F9;
		}
		.border_2 {
			border: 2upx solid #1A87F5;
		}
	}
</style>
