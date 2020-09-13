<template>
	<view class="container">
		<!-- 顶部 -->
		<view class="top column fixed b-CCC z-999">
			<view class="b-009 w-100" :style="{ height: statusBarH + 'px'}"></view>
		</view>
		<view class="content p-x-16 b-b column" :style="{ marginTop: statusBarH + 'px' }">
			<view class="f-end w-100 j-center" style="height: 88rpx;">
				<image class="image_setup" src="../../static/images/pro_1.png" mode="" @tap="enterSetUp"></image>
			</view>
			<!-- 简介 -->
			<view class="m-b-30 j-center">
				<image class="image-60 b-r-50" :src="userInfo.avatar?userInfo.avatar:'../../static/images/pro_2.png'" mode="" @tap="enterHeadImg"></image>
				<view class="flex_1 column m-l-10">
					<view class="m-b-8 j-center">
						<text class="f-18 f-w-600">{{userInfo.username}}</text>
						<view v-if="userInfo.level == 0" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">普通矿工</view>
						<view v-if="userInfo.level == 1" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">青铜矿工</view>
						<view v-if="userInfo.level == 2" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">白银矿工</view>
						<view v-if="userInfo.level == 3" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">黄金矿工</view>
						<view v-if="userInfo.level == 4" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">铂金矿工</view>
						<view v-if="userInfo.level == 5" class="j-center f-center m-l-10" style="border-radius: 8rpx;border: 2rpx solid #a0c5ff;font-size: 20rpx;">至尊矿工</view>
					</view>
				</view>
			</view>
			<!-- 我的订单 -->
			<view class="f-between j-center m-b-10">
				<text class="f-w-600">我的订单</text>
			</view>
			<view class="b-b b-F9F m-b-20"  style="padding: 40rpx 20rpx;border-radius: 30rpx;justify-content: space-around;">
				<view class="column j-center" v-for="(item,i) in dataList1" :key="i" @tap="enterOrder(i)">
					<image class="image-40 m-b-10" :src="'../../static/images/pro_' + (i+4) +'.png'" mode=""></image>
					<text class="f-14 f-w-600">{{item}}</text>
				</view>
			</view>
			<!-- 我的钱包 -->
			<view class="f-between j-center m-b-10">
				<text class="f-w-600">我的钱包</text>
				<!-- <image class="image-12" src="../../static/images/pro_12.png" mode=""></image> -->
			</view>
			<view class="b-b column c-w wallet m-b-30" style="padding: 32rpx 0 32rpx;background-color: #000000;border-radius: 20rpx;">
				<view class="f-end" @tap="enterWallet">
					<view class="text j-center f-center f-13">进入钱包</view>
				</view>
				<view class="f-center j-center m-b-20">
					<text class="c-808">账户资产总折合(USDT)</text>
					<!-- <image class="image-12 m-l-5" style="width: 40rpx;height: 22rpx;" src="../../static/images/pro_14.png" mode=""></image> -->
					<image class="image-12 m-l-5" style="width: 40rpx;height: 22rpx;" :src="'../../static/images/'+ imageSet +'.png'" mode="" @tap="hideSel"></image>
				</view>
				<view v-if="imageSet == 'pro_30'" class="column">
					<view class="f-center f-24 m-b-8">******</view>
					<!-- <view class="f-center f-14 c-808">******</view> -->
				</view>
				<view v-else class="column">
					<view class="f-center f-24 m-b-8">{{totalAssets}}</view>
					<!-- <view class="f-center f-14 c-808">≈{{totalCny}}CNY</view> -->
				</view>
			</view>
			<view class="f-between b-b" style="padding: 0 20rpx;border-radius: 30rpx;">
				<view class="column j-center" v-for="(item,i) in dataList2" :key="i" @tap="enter(i)">
					<image class="image-40 m-b-10" :src="'../../static/images/pro_' + (i+8) +'.png'" mode=""></image>
					<text class="f-14 f-w-600">{{item}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { _toast } from '@/common/js/funs'
	
	export default {
		onShow() {
			this.$store.dispatch('setUserInfo');//用户信息
			this.$store.dispatch('setCoinInfo');//币种信息
			// this.userInfo = uni.getStorageSync('userInfo');
			setTimeout(()=> {
				this.setUpCoinList();
			},500)
		},
		computed: {
			...mapState(['statusBarH','haslogin','userInfo']),
			totalAssets() {
				return parseFloat(this.userInfo.assets.totalAssets).toFixed(4)
			},
			totalCny() {
				return (this.totalAssets*7).toFixed(4)
			}
		},
		data() {
			return {
				dataList1: ['订单','待发货','待签收'],
				dataList2: ['我的团队','关于我们','分享应用','帮助中心'],
				urlList: ['myTeam','aboutUs','share','help'],
				orderList: ['noPay','noDeliver','noSign','afterSale'],
				imageSet: 'pro_30'
			}
		},
		methods: {
			setUpCoinList() {
				let coinSettingLsit = uni.getStorageSync('coinSettingLsit');//币配置
				let coinList = uni.getStorageSync('coinList');//币列表
				coinList.forEach((item,i)=> {
					let index = coinSettingLsit.findIndex(x=>x.EnName == item.CoinName);
					coinList[i].image = coinSettingLsit[index].Logo;
					// coinList[i].isChongZhi = coinSettingLsit[index].IsRecharge;//充值
					coinList[i].isTiXian = coinSettingLsit[index].IsWithDraw;//提现
					coinList[i].shouXuFeiType = coinSettingLsit[index].withdraw_fee_type;//手续费 1：固定费用 2 固定费率
					coinList[i].guDingFeiYong = coinSettingLsit[index].WithDrawFee;//固定费用 手续费
					coinList[i].guDingFeiLvMin = coinSettingLsit[index].MinWithDrawFee;//固定费率 最低手续费
					coinList[i].guDingFeiLvMax = coinSettingLsit[index].max_withdraw_fee;//固定费率 最高手续费
					coinList[i].tiXianShouXuFei = coinSettingLsit[index].withdraw_rate;//提现手续费单价
					coinList[i].RechargeInfo = coinSettingLsit[index].RechargeInfo;//充值提示
					// coinList[i].tiXianMin = coinSettingLsit[index].MinWithDraw;//提现最低
					// coinList[i].tiXianMax = coinSettingLsit[index].MaxWithDraw;//提现最高
					coinList[i].chongZhiMin = parseFloat(coinSettingLsit[index].MinRecharge).toFixed(4);//最低充值
					
					
				});
				uni.setStorage({
					key: "coinList",
					data: coinList
				});
				
			},
			enterHeadImg() {//设置头像
				uni.navigateTo({
					url: '/pages/profile/headImg'
				})
			},
			enterWallet() {//进入钱包
				uni.navigateTo({
					url: '/pages/profile/wallet/wallet'
				})
			},
			enterOrder(i) {//订单页面
				uni.navigateTo({
					url: ('/pages/profile/orderMes/' + this.orderList[i])
				})
			},
			enter(i) {//进入我的团队 、关于我们、分享应用、帮助中心
				uni.navigateTo({
					url: ('/pages/profile/' + this.urlList[i])
				})
			},
			enterSetUp() {//进入设置
				uni.navigateTo({
					url: '/pages/profile/setUp'
				})
			},
			enterLogin() {//进入 登录
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			hideSel() {
				if(this.imageSet == 'pro_30') {
					this.imageSet = 'pro_14'
				}else {
					this.imageSet = 'pro_30'
				}
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.content {
			.image_setup {
				width: 44rpx;
				height: 44rpx;
			}
			.wallet {
				.text {
					width: 160rpx;
					height: 40rpx;
					border-radius: 50rpx 0 0 50rpx;
					background-color: #1a1a1a;
					color: #1A87F5;
				}
			}
		}
	}
</style>
