<template>
	<view class="container p-16 b-b">
		<view class="column" v-for="(item,i) in orderList" :key="i" @tap="enter(i)">
			<view class="b-r-15 b-F9F j-center b-b m-b-10" style="padding: 20rpx;">
				<image class="image b-r-10" :src="item.image" mode=""></image>
				<view class="flex_1 column f-between m-l-10">
					<text class="m-b-5 f-18 f-w-600">{{item.name}}</text>
					<text class="m-b-20">算力:{{item.pow}}T</text>
					<view class="f-between j-center">
						<text class="f-18 c-1A8">{{item.real_amount}}USDT</text>
						<!-- <view class="f-w-600 b-b b-1A8 c-w b-r-5" style="padding: 10rpx;">再次购买</view> -->
					</view>
				</view>
			</view>
			<view class="b-r-15 b-F9F b-b column content m-b-10" style="padding: 40rpx 32rpx 0;">
				<view class="flex_1 f-between m-b-20" v-for="(item1,index) in dataList" :key="index">
					<text class="f-w-600">{{item1}}</text>
					<text v-if="index == 0">{{item.kj_amount}}USDT</text>
					<text v-if="index ==1">{{item.number}}</text>
					<text v-if="index == 2">{{item.delivery_amount}}USDT</text>
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
				dataList: ['商品金额','商品数量','商品运费'],
				orderList: [],
				page: 1,
				noMore: false,
				loading: false,
				noData: false,
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
				let message = '';
				if(options == 'loading') {
					message = ''
				}else {
					message = '加载中'
				};
				let res = await this.$myRequest({
					url: 'order/list',
					message,
					data: {
						page: this.page,
						count: 10,
						status: 2
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
						item.delivery_amount = parseFloat(item.delivery_amount).toFixed(4);
						item.kj_amount = parseFloat(item.kj_amount).toFixed(4);
						let index = this.kjList.findIndex(x=>x.id == item.kj_id);
						if(index !== -1) {
							item.image = this.kjList[index].image[0];
							item.name = this.kjList[index].name;
							item.pow = this.kjList[index].pow;
						}
					})
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
