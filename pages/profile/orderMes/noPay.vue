<template>
	<view class="container p-16 b-b">
		<view class="column" v-for="(item,i) in orderList" :key="i" @tap="enter(i)">
			<view class="b-r-15 b-F9F column b-b m-b-8" style="padding: 20rpx;">
				<view class="f-between m-b-20">
					<image class="image b-r-10 " :src="item.image" mode=""></image>
					<view class="flex_1 column f-between m-l-10">
						<text class="m-b-5 f-18 f-w-600">{{item.name}}</text>
						<text class="m-b-20">算力:{{item.pow}}T</text>
						<view class="f-between">
							<text class="f-18 c-1A8">{{item.real_amount}}USDT</text>
							<text class="f-14 c-CCC">共{{item.number}}件</text>
						</view>
					</view>
				</view>
				<view class="f-between">
					<view class="j-center">
						<image class="image-18" src="../../../static/images/pro_31.png" mode=""></image>
						<text v-if="item.status == 1" class="f-14 f-w-600 c-1A8 m-l-5">待付款</text>
						<text v-if="item.status == 2" class="f-14 f-w-600 c-1A8 m-l-5">待发货</text>
						<text v-if="item.status == 3" class="f-14 f-w-600 c-1A8 m-l-5">待收货</text>
						<text v-if="item.status == 4" class="f-14 f-w-600 c-1A8 m-l-5">已完成</text>
						<text v-if="item.status == 5" class="f-14 f-w-600 c-1A8 m-l-5">取消</text>
					</view>
					<!-- <view style="width: 200rpx; height: 88rpx;" class="j-center f-center f-18 c-w b-1A8 b-r-5">去支付</view> -->
				</view>
			</view>
		</view>
		<view v-if="noData" class="column j-center">
			<image style="width: 120rpx;height: 108rpx;margin: 200rpx 0 32rpx;" src="../../../static/images/home_9.png" mode=""></image>
			<text class="f-14 c-CCC">什么都没有哦~</text>
		</view>
		<view v-if="noMore" class="f-center f-13">没有更多的数据~</view>
		<view v-if="loading" class="f-center f-13">加载中...</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.kjList = uni.getStorageSync('kjList');
			this.getOrderList();
		},
		data() {
			return {
				orderList: [],
				noMore: false,
				loading: false,
				noData: false,
				page: 1,
				kjList: [],
			}
		},
		onReachBottom() {
			if(!this.noMore) {
				this.loading = true;
				this.page ++;
				this.getOrderList('loading')
			}
		},
		methods: {
			async getOrderList(options) {
				let message = '加载中'
				if(options == 'loading') {
					message = ''
				};
				let res = await this.$myRequest({
					url: 'order/list',
					message: message,
					data: {
						page: this.page,
						count: 10,
						status: 0
					}
				});
				if(res.data.code == 200) {
					this.loading = false;
					let total = res.data.data.total;
					if(total == 0) {
						this.noData = true;
						return
					};
					this.orderList = [...this.orderList,...res.data.data.data];
					this.noData = false;
					if(this.orderList.length < total) {
						this.noMore = false;
					}else {
						this.noMore = true;
					};
					this.orderList.forEach((item,i)=> {
						item.real_amount = parseFloat(item.real_amount).toFixed(4);
						let index = this.kjList.findIndex(x=>x.id == item.kj_id);
						if(index !== -1) {
							item.image = this.kjList[index].image[0];
							item.name = this.kjList[index].name;
							item.pow = this.kjList[index].pow;
						}
					});
				}
			},
			enter(i) {
				uni.setStorage({
					key: 'orderDetail',
					data: this.orderList[i]
				});
				uni.navigateTo({
					url: '/pages/profile/orderMes/orderDetail'
				})
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
