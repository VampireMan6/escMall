<template>
	<view class="container p-x-16 b-b">
		<!-- 顶部 -->
		<view class="b-b column c-w wallet m-b-30" style="padding: 60rpx 0 30rpx;background-color: #000000;border-radius: 20rpx;">
			<view class="f-center j-center" style="margin-bottom: 30rpx;">
				<text class="c-808">总资产(USDT)</text>
			</view>
			<view class="f-center f-24 m-b-30">{{totalAssets}}</view>
			<view class="f-between b-b" style="padding: 0 90rpx;">
				<view class="column j-center" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
					<image class="image-20 b-r-50 m-b-8" :src="'../../../static/images/pro_' + (i + 22) +'.png'" mode=""></image>
					<view class="f-13 c-808">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- 我的资产列表 -->
		<view class="b-b f-between j-center b-F9F m-b-5" style="padding: 20rpx 30rpx 20rpx 20rpx;border-radius: 30rpx;" v-for="(item,i) in coinList">
			<view class="j-center">
				<image v-if="item.image !== ''" class="image-30 b-r-50" :src="item.image" mode=""></image>
				<image v-else class="image-30 b-r-50" src="../../../static/images/pro_15.png" mode=""></image>
				<text class="f-18 f-w-600 m-l-5">{{item.CoinName}}</text>
			</view>
			<view class="column" style="align-items: flex-end;">
				<text class="f-w-600">{{item.Money}}</text>
				<!-- <text class="f-13 c-CCC">{{item.totalCny}} CNY</text> -->
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.list = uni.getStorageSync('coinList');
		},
		data() {
			return {
				// dataList: ['充值','提现','转账','账单'],
				dataList: ['充值','提现','账单'],
				userInfo: [],
				coinSettingLsit: [],
				// urlList: ['recharge','withdrawal','transfer','bill'],
				urlList: ['recharge','withdrawal','bill'],
				list: []
			}
		},
		computed: {
			totalAssets() {
				return (parseFloat(this.userInfo.assets.totalAssets)).toFixed(4)
			},
			coinList() {
				this.list.forEach((item,i)=> {
					this.list[i].totalCny = (parseFloat(item.Money)*7).toFixed(4)
				});
				return this.list
			}
		},
		methods: {
			enter(i) {
				uni.navigateTo({
					url: ('/pages/profile/wallet/' + this.urlList[i])
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
		.wallet {
			.text {
				width: 80rpx;
				height: 40rpx;
				border-radius: 50rpx 0 0 50rpx;
				background-color: #555555;
				color: #1A87F5;
			}
		}
	}
</style>
