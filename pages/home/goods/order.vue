<template>
	<view class="container p-x-16 b-b">
		<!-- 地址 -->
		<view class="content b-r-15 b-F9F f-center j-center m-b-20 p-x-16 b-b" @tap="enterAddress">
			<view v-if="addressItem.length !== 0" class="w-100 f-between j-center">
				<view class="flex_1 column">
					<view class="j-center">
						<text class="c-1A8 f-w-600">{{addressItem.name}}</text>
						<text class="m-l-5">{{addressItem.tel}}</text>
						<text v-if="addressItem.is_default" class="f-10 c-1A8 m-l-10">默认</text>
					</view>
					<text class="f-13 f-w-600">{{addressItem.province}} {{addressItem.city}} {{addressItem.county}} {{addressItem.address}}</text>
				</view>
				<image class="image-15" src="../../../static/images/home_6.png" mode=""></image>
			</view>
			<view v-else class="j-center">
				<image class="image-20 b-r-50" src="../../../static/images/home_2.png" mode=""></image>
				<text class="m-l-5">请添加收货地址</text>
			</view>
		</view>
		<!-- 购买信息 -->
		<view class="b-r-15 b-F9F j-center b-b m-b-8" style="padding: 20rpx;">
			<image class="image b-r-10" :src="dataDetail.image[0]" mode=""></image>
			<view class="flex_1 column f-between m-l-10">
				<text class="m-b-5 f-18 f-w-600">{{dataDetail.name}}</text>
				<text class="m-b-20">算力:{{parseFloat(dataDetail.pow).toFixed(4)}}T</text>
				<view class="f-between">
					<text class="f-18 c-1A8">{{parseFloat(dataDetail.price).toFixed(4)}}USDT</text>
					<view class="j-center">
						<image v-if="stopState" class="image-20" src="../../../static/images/home_1.png" mode="" @tap="shop('reduce')"></image>
						<image v-else class="image-20" src="../../../static/images/home_3.png" mode="" @tap="shop('reduce')"></image>
						<text class="m-l-5 f-w-600">{{number}}</text>
						<image class="m-l-5 image-20" src="../../../static/images/home_2.png" mode="" @tap="shop('add')"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 价钱 -->
		<view class="b-r-15 b-F9F column b-b m-b-8" style="padding: 32rpx 20rpx;">
			<view class="f-between m-b-20">
				<text class="f-w-600">商品金额</text>
				<text>{{price}}USDT</text>
			</view>
			<view class="f-between">
				<text class="f-w-600">商品运费</text>
				<text>{{deliveryFee}}USDT</text>
			</view>
		</view>
		<view class="f-end">
			<text class="c-CCC">合计:</text><text class="c-1A8 m-l-5">{{total}}USDT</text>
		</view>
		<!-- 底部 -->
		<view class="fixed z-1 bottom p-x-16 b-b j-center f-between w-100">
			<view>
				<text class="c-CCC">合计:</text><text class="c-1A8 m-l-5">{{total}}USDT</text>
			</view>
			<view class="view b-1A8 j-center f-center c-w f-w-600" @tap="payment">立即支付</view>
		</view>
		<uni-popup ref="pop" type="bottom" @close="close">
			<view class="pop_bottom b-w column">
				<view class="f-between j-center w-100" style="height: 130rpx;">
					<i class="uni-btn-icon c-1F1" style="font-size: 27px;" @tap="close"></i>
					<text class="f-18 f-w-600">立即支付</text>
					<view style="width: 54rpx;"></view>
				</view>
				<view class="w-100 column j-center p-x-16 b-b">
					<text class="f-30 f-w-600 c-1A8 m-b-10">{{total}} <text class="f-15 c-CCC">USDT</text> </text>
					<!-- <view class="c-CCC m-b-30">剩余：23小时58分钟</view> -->
					<view class="f-between j-center w-100 b-r-5 b-b m-b-8" style="border: 2upx solid #1A87F5;padding: 14rpx 20rpx;">
						<view class="j-center">
							<image class="image-30 b-r-50" src="../../../static/images/home_10.png" mode=""></image>
							<text class="f-w-600 m-l-10">USDT</text>
						</view>
						<image class="image-15 b-r-15" src="../../../static/images/home-11.png" mode=""></image>
					</view>
					<view class="w-100">
						<text class="w-100 m-b-10 f-13">账户可用: {{usdtNumber}} <text> USDT</text></text>
					</view>
					<input type="text" style="height: 100rpx;" v-model="pay_password" class="b-F9F w-100 m-b-20 p-x-16 b-b b-r-5" placeholder="请输入支付密码">
					<btnSelf class="w-100" text="支付" :state="true" @btnClick="btnClick"></btnSelf>
					<view style="height: 100rpx;"></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { _toast } from '@/common/js/funs'
	
	export default {
		onLoad(options) {
			// this.addressItem = this.$store.state.addressList.filter(x=> x.default == true)[0];
			this.number = options.number;
			if(this.number == 1) {
				this.stopState = true;
			}else {
				this.stopState = false;
			};
			let dataDetail = uni.getStorageSync('kjDetail');
			this.dataDetail = dataDetail;
			this.pow = parseFloat(dataDetail.pow).toFixed(4);
			this.shopId = dataDetail.id;
			let coinList = uni.getStorageSync('coinList');
			let index = coinList.findIndex(x=>x.CoinName == 'USDT');
			this.usdtNumber = coinList[index].Money;
		},
		onShow() {
			this.$store.dispatch('setUserInfo');//用户信息
			let list = uni.getStorageSync('selectAddress');
			if(list) {
				this.addressItem = list;
				this.addressId = this.addressItem.id;
				uni.removeStorage({
					key: 'selectAddress'
				})
			}else {
				this.getAddressDefault();
			}
		},
		data() {
			return {
				dataDetail: [],//商品信息
				addressItem: [],//地址信息
				number: 1,//购买数量
				shopId: "",//商品id
				stopState: true,//
				// deliveryFee: 0,//运费
				addressId: 999999,//地址id
				usdtNumber: "",//可用usdt数量
				addressIdStatus: false,
				pay_password: "",//支付密码
			}
		},
		computed: {
			...mapState(['userInfo']),
			price() {
				return (parseFloat(this.dataDetail.price)*this.number).toFixed(4);
			},
			deliveryFee() {
				return (parseFloat(this.dataDetail.delivery_fee)*this.number).toFixed(4);
			},
			total() {
				return (parseFloat(this.price) + parseFloat(this.deliveryFee)).toFixed(4)
			}
		},
		methods: {
			async getAddressDefault() {//默认地址
				let res = await this.$myRequest({
					url: 'user/address/default'
				});
				if(res.data.code == 200) {
					if(res.data.data !== null) {
						this.addressItem = res.data.data;
						this.addressId = this.addressItem.id;
					}
				}
			},
			enterAddress() {
				uni.navigateTo({
					url: '/pages/home/address/address'
				})
			},
			payment() {
				this.$refs.pop.open();
			},
			close() {
				this.$refs.pop.close()
			},
			btnClick() {
				if(this.userInfo.is_pay_password == 0) {//交易密码未设置
					uni.showModal({
						content: "交易密码未设置",
						confirmText: '去设置',
						success: (res) => {
							if(res.confirm) {
								uni.navigateTo({
									url: '/pages/profile/setUp'
								});
							}
						}
					})
					return
				};
				if(parseFloat(this.usdtNumber) < parseFloat(this.total)) {
					_toast('账户USDT余额不足');
					return;
				};
				if(this.addressId == 999999) {
					_toast('请先添加收货地址哦');
					return
				};
				if(!this.pay_password) {
					_toast('支付密码不能为空');
					return
				}
				this.orderBuy();
			},
			async orderBuy() {//支付
				let res = await this.$myRequest({
					url: 'order/pay',
					method: "POST",
					data: {
						kj_id: this.shopId,
						number: this.number,
						address_id: this.addressId,
						pay_password: this.pay_password
					}
				});
				console.log(res)
				if(res.data.code == 200) {
					_toast('购买成功');
					this.$store.dispatch('setUserInfo');//用户信息
					this.$store.dispatch('setCoinInfo');//币种信息
					setTimeout(()=> {
						uni.navigateBack({})
					},1000)
				}else {
					_toast(res.data.message);
				}
			},
			shop(options) {
				if(options == 'reduce') {//减少
					if(this.number == 1) {
						_toast('不能再减少了');
						this.stopState = true;
					}else if(this.number == 2) {
						this.number--;
						this.stopState = true;
					}else {
						this.number--;
					}
				}else {
					this.number++;
					this.stopState = false;
				};
				uni.setStorage({
					key: 'shopNumber',
					data: this.number
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
		.content {
			height: 120rpx;
		}
		.image {
			width: 220rpx;
			height: 220rpx;
		}
		.bottom {
			bottom: 68upx;
			left: 0;
			right: 0;
			.view {
				width: 300rpx;
				height: 88rpx;
				border-radius: 10rpx;
			}
		}
		.pop_bottom {
			// height: 722rpx;
			width: 100vw;
			border-radius: 50rpx 50rpx 0 0;
		}
	}
</style>
