<template>
	<view class="container p-16 b-b f-14">
		<view class="b-r-15 b-F9F column b-b m-b-8" style="padding: 20rpx;">
			<view class="f-between m-b-20">
				<image class="image b-r-10 " :src="orderDetail.image" mode=""></image>
				<view class="flex_1 column f-between m-l-10">
					<text class="m-b-5 f-18 f-w-600">{{orderDetail.name}}</text>
					<text class="m-b-20">算力:{{orderDetail.pow}}T</text>
					<view class="f-between">
						<text class="f-18 c-1A8">{{orderDetail.real_amount}}USDT</text>
						<text class="f-14 c-CCC">共{{orderDetail.number}}件</text>
					</view>
				</view>
			</view>
			<view class="f-between m-b-20">
				<view class="j-center">
					<image class="image-18" src="../../../static/images/pro_31.png" mode=""></image>
					<text v-if="orderDetail.status == 1" class="f-14 f-w-600 c-1A8 m-l-5">待付款</text>
					<text v-if="orderDetail.status == 2" class="f-14 f-w-600 c-1A8 m-l-5">待发货</text>
					<text v-if="orderDetail.status == 3" class="f-14 f-w-600 c-1A8 m-l-5">待收货</text>
					<text v-if="orderDetail.status == 4" class="f-14 f-w-600 c-1A8 m-l-5">已完成</text>
					<text v-if="orderDetail.status == 5" class="f-14 f-w-600 c-1A8 m-l-5">取消</text>
				</view>
				<!-- <view style="width: 200rpx; height: 88rpx;" class="j-center f-center f-18 c-w b-1A8 b-r-5">去支付</view> -->
			</view>
			<view class="f-between m-b-10">
				<text>收货人</text>
				<text class="f-13 ">{{orderDetail.address_name}}</text>
			</view>
			<view class="f-between m-b-10">
				<text>联系电话</text>
				<text class="f-13 ">{{orderDetail.address_mobile}}</text>
			</view>
			<view class="f-between m-b-10">
				<text>收货地址</text>
				<text class="f-13 ">{{orderDetail.address_detail}}</text>
			</view>
			<view class="f-between m-b-10">
				<text>下单时间</text>
				<text class="f-13 ">{{orderDetail.pay_time}}</text>
			</view>
			<view v-if="orderDetail.sn" class="f-between m-b-10" @tap="copy(1)">
				<text>订单号</text>
				<text class="f-13 ">{{orderDetail.sn}}</text>
			</view>
			<view v-if="orderDetail.delivery_sn" class="f-between" @tap="copy(2)">
				<text>物流单号</text>
				<text class="f-13 ">{{orderDetail.delivery_sn}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.orderDetail = uni.getStorageSync('orderDetail');
		},
		data() {
			return {
				orderDetail: []
			}
		},
		methods: {
			copy(i) {
				let str = '';
				if(i == 1) {
					str = this.orderDetail.sn;
				}else {
					str = this.orderDetail.delivery_sn;
				}
				uni.setClipboardData({
					data: str,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.image {
			width: 220rpx;
			height: 220rpx;
		}
	}
</style>
