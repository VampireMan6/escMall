<template>
	<view class="container p-x-16 b-b">
		<select-coin class="m-b-40" :select_text="select_text" @select="enterSelect">
			<image slot="image" class="image-30 b-r-50" :src="coinImage" mode=""></image>
		</select-coin>
		<!-- 提现数量 -->
		<view class="f-w-600 m-b-5">提现数量</view>
		<view class="f-between j-center b-F9F b-r-10 m-b-5" style="padding: 30rpx 20rpx;">
			<input class="flex_1 b-b f-w-600" type="number" v-model="number" placeholder="请输入提现数量" placeholder-class="f-15 c-CCC" />
			<text class="c-1A8" @tap="allCoin">全部</text>
		</view>
		<view class="f-13 c-CCC m-b-20">{{select_text}}可用:{{useCoinNumber}}</view>
		<!-- 接收地址 -->
		<view class="f-w-600 m-b-5">接收地址</view>
		<view class="f-between j-center b-F9F b-r-10 m-b-5" style="padding: 30rpx 20rpx;">
			<input class="flex_1 b-b f-w-600" type="text" v-model="address" :placeholder="placeholder_text" placeholder-class="f-15 c-CCC" />
			<image v-if="address.trim().length !== 0" class="image-15" src="../../../static/images/pro_17.png" mode="" @tap="delect('address')"></image>
		</view>
		<!-- 0.00051968=1.3502CNY -->
		<view class="f-13 c-CCC m-b-20">手续费:{{shouxufei}}</view>
		<!-- 交易密码 -->
		<view class="j-center">
			<view class="f-w-600 m-b-5">交易密码</view>
			<view v-if="false" class="j-center m-l-5">
				<image class="image-15" src="../../../static/images/pro_16.png" mode=""></image>
				<text class="f-10" style="color: #DE1313;">交易密码错误。</text>
			</view>
		</view>
		<view class="f-between j-center b-F9F b-r-10 m-b-40" style="padding: 30rpx 20rpx;">
			<input :password="passState" class="flex_1 b-b f-w-600" type="text" v-model="psw" placeholder="请输入交易密码" placeholder-class="f-15 c-CCC" />
			<view v-if="psw.trim().length !== 0" class="j-center">
				<image class="image-15" src="../../../static/images/pro_17.png" mode="" @tap="delect('psw')"></image>
				<image class="m-l-10" style="width: 32rpx; height: 24rpx;" :src="'../../../static/images/'+ image_psw +'.png'" mode="" @tap="pswSelect"></image>
			</view>
		</view>
		<!--提现 -->
		<btnSelf text="确认提现" :state="true" @btnClick="btnClick"></btnSelf>
		<!-- 弹出层 -->
		<uni-popup ref="pop" type="bottom" @close="close">
			<view class="pop_bottom b-w column">
				<view class="f-between j-center w-100" style="height: 130rpx;">
					<i class="uni-btn-icon c-1F1" style="font-size: 27px;" @tap="back"></i>
					<text class="f-18 f-w-600">选择币种</text>
					<view style="width: 54rpx;"></view>
				</view>
				<scroll-view scroll-y="true" style="height: 590rpx;padding-bottom: 68upx;" class="b-b">
					<view class="column p-x-16 b-b">
						<view :class="i==tabClick?'border_1A8':'border_fff'" class="b-F9F b-r-5 b-b f-between j-center m-b-10" style="padding: 14rpx 20rpx;" 
						v-for="(item,i) in coinList" :key="i" @tap="select(i)">
							<view class="j-center">
								<image v-if="item.image" class="image-30 b-r-50" :src="item.image" mode=""></image>
								<image v-else class="image-30 b-r-50" src="../../../static/images/pro_15.png" mode=""></image>
								<text class="m-l-10">{{item.CoinName}}</text>
							</view>
							<image v-if="i == tabClick" class="image-15 b-r-50" src="../../../static/images/pro_15.png" mode=""></image>
							<view v-else class="image-15 b-r-50 b-w"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import selectCoin from '@/components/selectCoin.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { _toast } from '@/common/js/funs'
	import {	mapState	} from 'vuex'
	
	export default {
		onLoad() {
			this.coinList = uni.getStorageSync('coinList');
		},
		computed: {
			...mapState(['userInfo']),
			select_text() {
				return this.coinList[this.tabClick].CoinName
			},
			coin_id() {
				return this.coinList[this.tabClick].CoinId;
			},
			coinImage() {
				if(this.coinList[this.tabClick].image) {
					return this.coinList[this.tabClick].image;
				}else {
					return '../../../static/images/pro_15.png';
				}
			},
			useCoinNumber() {
				return parseFloat(this.coinList[this.tabClick].Money).toFixed(4)
			},
			placeholder_text() {
				return '请输入' + this.select_text + '地址'
			},
			// placeholder() {
			// 	return '最少提现' + parseFloat(this.coinList[this.tabClick].tiXianMin).toFixed(4) + this.select_text;
			// },
			shouxufei() {
				if(this.coinList[this.tabClick].shouXuFeiType == 1) {//固定费用
					return parseFloat(this.coinList[this.tabClick].guDingFeiYong).toFixed(4)
				}else {//固定费率
					if(this.number !== '') {
						let total = parseFloat(this.number)*parseFloat(this.coinList[this.tabClick].tiXianShouXuFei);
						return total
						// let guDingFeiLvMin = parseFloat(this.coinList[this.tabClick].guDingFeiLvMin);
						// let guDingFeiLvMax = parseFloat(this.coinList[this.tabClick].guDingFeiLvMax);
						// if(total < guDingFeiLvMin) {//手续费 小于最低手续费 
						// 	return guDingFeiLvMin
						// }else if(total > guDingFeiLvMax) {//手续费 大于 最大手续费
						// 	return guDingFeiLvMax
						// }else {//手续费 介于 最低 最大 之间
						// 	return total
						// }
					}else {
						return 0
					}
				}
			},
			shouxufeiCny() {
				return (this.shouxufei*7).toFixed(4)
			}
		},
		components: {
			selectCoin
		},
		data() {
			return {
				coinList: [],
				tabClick: 0,
				number: "",//提币数量
				address: "",//地址
				psw: "",//密码
				passState: true,
				image_psw: "pro_18",
				status: false,
			}
		},
		methods: {
			enterSelect() {//选择列表弹出
				this.$refs.pop.open()
			},
			allCoin() {
				this.number = this.useCoinNumber;
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
				if(!this.number) {
					_toast('提币数量不能为空');
					return;
				};
				// if(this.number > this.useCoinNumber) {
				// 	_toast('提币数量不能超过可用数量哦');
				// 	return;
				// };
				// if(this.number < parseFloat(this.coinList[this.tabClick].tiXianMin)) {
				// 	_toast('提币数量不能少于最少提币数量哦');
				// 	return;
				// };
				// if(this.number > parseFloat(this.coinList[this.tabClick].tiXianMax)) {
				// 	_toast('提币数量不能超过最大提币数量哦');
				// 	return;
				// };
				if(!this.address) {
					_toast('提币地址不能为空');
					return;
				};
				if(!this.psw) {
					_toast('交易密码不能为空');
					return;
				};
				if(!this.status) {
					this.status = true;
					this.getCoinSetting();
				}
			},
			async getCoinSetting() {
				let res = await this.$myRequest({
					url: 'coins/withdraw',
					message: "提现中",
					method: 'POST',
					data: {
						coin_id: this.coin_id,
						number: this.number,
						address: this.address,
						pay_password: this.psw
					}
				});
				if(res.data.code == 200) {
					_toast('提现成功');
					this.$store.dispatch('setUserInfo');//用户信息
					setTimeout(()=> {
						uni.navigateBack({})
					},1000)
				}else {
					_toast(res.data.message);
				};
				this.status = false;
			},
			back() {//关闭遮罩层
				this.$refs.pop.close()
			},
			select(i) {//币种选择
				this.tabClick = i;
				this.close()
			},
			delect(options) {//删除input内容
				if(options == 'address') {
					this.address = ""
				}else {
					this.psw = ""
				}
			},
			pswSelect() {//交易密码 隐藏 显示
				if(this.passState) {
					this.image_psw = 'pro_19';
				}else {
					this.image_psw = 'pro_18'
				};
				this.passState = !this.passState;
			},
			close() {
				this.$refs.pop.close()
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.pop_bottom {
			height: 720rpx;
			width: 100vw;
			border-radius: 50rpx 50rpx 0 0;
			.border_1A8 {
				border: 2upx solid #1A87F5;
			}
			.border_fff {
				border: 2upx solid #FFFFFF;
			}
		}
	}
</style>
