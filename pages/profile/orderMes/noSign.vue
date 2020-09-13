<template>
	<view class="container p-16 b-b">
		<view class="column b-F9F m-b-10 b-r-5" v-for="(item,i) in orderList" :key="i">
			<view class="b-r-15 b-F9F j-center b-b m-b-10" style="padding: 20rpx;">
				<image class="image b-r-10" :src="item.image" mode=""></image>
				<view class="flex_1 column f-between m-l-10">
					<text class="m-b-5 f-18 f-w-600">{{item.name}}</text>
					<text class="m-b-20">算力:{{item.pow}}T</text>
					<view class="f-between j-center">
						<text class="f-18 c-1A8">{{item.real_amount}}USDT</text>
						<view class="f-w-600 b-b b-1A8 c-w b-r-5" style="padding: 10rpx;" @tap="orderConfirm(i)">签收</view>
					</view>
				</view>
			</view>
			<view class="b-b column" style="padding: 40rpx 32rpx 0;">
				<view class="f-between m-b-10">
					<text>商品金额</text>
					<text class="f-13 ">{{item.kj_amount}}</text>
				</view>
				<view class="f-between m-b-10">
					<text>商品数量</text>
					<text class="f-13 ">{{item.number}}</text>
				</view>
				<view class="f-between m-b-10">
					<text>商品运费</text>
					<text class="f-13 ">{{item.delivery_amount}}</text>
				</view>
				<view v-if="item.sn" class="f-between m-b-10" @tap="copy(item.sn)">
					<text>订单号</text>
					<text class="f-13 ">{{item.sn}}</text>
				</view>
				<view v-if="item.delivery_sn" class="f-between m-b-10" @tap="copy(item.delivery_sn)">
					<text>物流单号</text>
					<text class="f-13 ">{{item.delivery_sn}}</text>
				</view>
			</view>
			
			
			<!-- <view class="b-r-15 b-F9F b-b column content m-b-10" style="padding: 40rpx 32rpx 0;">
				<view class="flex_1 f-between m-b-20" v-for="(item1,index) in dataList" :key="index">
					<text class="f-w-600">{{item1}}</text>
					<text v-if="index == 0">{{item.kj_amount}}USDT</text>
					<text v-if="index ==1">{{item.number}}</text>
					<text v-if="index == 2">{{item.delivery_amount}}USDT</text>
					<text selectable="true" v-if="index == 3">{{item.sn}}</text>
					<text selectable="true" v-if="index == 4">{{item.delivery_sn}}</text>
				</view>
			</view> -->
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
	import { _toast } from '@/common/js/funs'
	
	export default {
		onLoad() {
			this.kjList = uni.getStorageSync('kjList');
			this.getOrderList();
		},
		data() {
			return {
				dataList: ['商品金额','商品数量','商品运费','订单号','物流单号'],
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
						status: 3
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
						item.image = this.kjList[index].image[0];
						item.name = this.kjList[index].name;
						item.pow = this.kjList[index].pow;
					});
					console.log(this.orderList)
				}
			},
			orderConfirm(i) {
				this.orderSure(i)
			},
			async orderSure(i) {
				let res = await this.$myRequest({
					url: 'order/confirm',
					method: 'POST',
					data: {
						order_id: this.orderList[i].id
					}
				});
				if(res.data.code == 200) {
					_toast('已签收成功');
					setTimeout(()=> {
						this.orderList.splice(i,1);
						if(this.orderList.length == 0) {
							this.noData = true;
							this.noMore = false;
						}
					},1000)
				}
			},
			copy(i) {
				uni.setClipboardData({
					data: i,
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
