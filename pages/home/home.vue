<template>
	<view class="container">
		<view class="fixed bcklogo w-100 z-1">
			<image class="h-100 w-100" src="../../static/images/logo_1.jpg" mode=""></image>
		</view>
		<view class="fixed z-999 b-b w-100 column bottom_content b-w" :style= "{ bottom: bottomH + 'px',height: scrollH + 'px' }">
			<scroll-view scroll-y="true" class="h-100">
				<view class="p-x-16 b-b column">
					<view class="b-F9F b-r-15 m-b-10 p-10 b-b" v-for="(item,i) in shopList" :key="i" @tap="enter(i)">
						<image class="item_image" :src="item.image[0]" mode=""></image>
						<view class="flex_1 column" style="margin-left: 40rpx;">
							<text class="f-w-600 f-18 m-b-5">{{item.name}}</text>
							<text class="m-b-20">算力:{{item.pow}}T</text>
							<text class="f-w-600 f-18 c-1A8">{{item.price}}USDT</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	
	export default {
		onLoad() {
			uni.getSystemInfo({
				success:(res)=> {
					this.bottomH = res.windowBottom;
					
				}
			});
			this.getCoinSetting();
		},
		onShow() {
			this.$store.dispatch('setUserInfo');//用户信息
			this.$store.dispatch('setCoinInfo');//币种信息
			this.getKjList();
		},
		data() {
			return {
				bottomH: 0,
				dataList: [],
				shopList: [],
				page: 1
			}
		},
		computed: {
			scrollH() {
				if(this.dataList.length == 1) {
					return 140
				}else {
					return 280
				}
			}
		},
		methods: {
			async getCoinSetting() {
				let res = await this.$myRequest({
					url: 'coins/setting'
				});
				if(res.data.code == 200) {
					uni.setStorage({
						key: 'coinSettingLsit',
						data: res.data.data
					});
				}
			},
			async getKjList() {//矿机列表信息
				let res = await this.$myRequest({
					url: 'kj/list',
					data: {
						count: 30,
						page: this.page
					}
				});
				if(res.data.code == 200) {
					this.dataList = res.data.data.data;
					this.dataList.forEach((item,i)=> {
						this.dataList[i].price = parseFloat(item.price).toFixed(4);
						this.dataList[i].pow = parseFloat(item.pow).toFixed(4);
						this.dataList[i].delivery_fee = parseFloat(item.delivery_fee).toFixed(4);
						this.dataList[i].images = item.images.substring(1,item.images.length-1);
					});
					this.shopList = JSON.parse(JSON.stringify(this.dataList));
					this.shopList.forEach((item,i)=> {
						this.shopList[i].image = item.images.split(",");
					});
					uni.setStorage({
						key: "kjList",
						data: this.shopList
					})
				}
			},
			enter(i) {
				uni.setStorage({
					key: "kjDetail",
					data: this.shopList[i]
				})
				uni.navigateTo({
					url: '/pages/home/goods/goods'
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
		.bcklogo {
			height: 100vh;
		}
		.bottom_content {
			// height: 260rpx;
			padding: 32rpx 0 0;
			border-radius: 50rpx 50rpx 0 0;
			.item_image {
				width: 220rpx;
				height: 220rpx;
			}
		}
	}
</style>
