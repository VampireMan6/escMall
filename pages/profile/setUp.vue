<template>
	<view class="container">
		<scroll-view scroll-y="true" class="column" :style="{ height: scroll + 'px'}">
			<view class="column p-x-16 b-b">
				<view class="f-between j-center item b-r-15 b-F9F p-x-10 b-b m-b-5" v-for="(item,i) in dataList" :key="i" @tap="enter(i)">
					<text v-if="i !== 2" class="f-w-600">{{item}}</text>
					<text v-else class="f-w-600">{{textPayPsw}}</text>
					<image v-if="i !== 3" class="image-18" src="../../static/images/home_6.png" mode=""></image>
					<text v-if="i == 3" class="f-13 c-CCC">{{version}}</text>
				</view>
			</view>
		</scroll-view>
		<view class="f-between j-center buttom p-x-16 b-b">
			<btnSelf class="w-100" text="退出登录" :state="true" @btnClick="btnClick"></btnSelf>
		</view>
	</view>
</template>

<script>
	import {	mapState	} from 'vuex'
	import { _toast,navigateTo } from '@/common/js/funs' 
	import update from '@/common/js/update.js'
	
	export default {
		onLoad() {
			// #ifdef APP-PLUS
			let self = this;
			plus.runtime.getProperty(plus.runtime.appid, function(info) {
				self.version = info.version;
			})
			// #endif
			uni.getSystemInfo({
				success: (res)=> {
					this.device = res.platform
				}
			});
		},
		onShow() {
			uni.removeStorage({
				key: 'selectAddress'
			})
		},
		data() {
			return {
				dataList: ['收货地址', '更改密码','', '检查更新'],
				version: "",
				device: "",
			}
		},
		computed: {
			...mapState(['scrollHeight','userInfo']),
			scroll() {
				return this.scrollHeight - uni.upx2px(266)
			},
			textPayPsw() {
				if(this.userInfo.is_pay_password == 0) {//未设置支付密码
					return '支付密码设置'
				}else {
					return '修改支付密码'
				}
			}
		},
		methods: {
			enter(i) {
				if (i == 0) {//收货地址
				navigateTo('/pages/home/address/address')
				}else if(i == 1) {//更改密码
				navigateTo('/pages/profile/forgetPsw')
				}else if(i == 3){//更新
					// #ifdef APP-PLUS
					this.getUpdate();
					// #endif
				}else {
					if(this.userInfo.is_pay_password == 0) {//支付密码
						navigateTo('/pages/profile/paymentPsw')
					}else {//修改支付密码
						navigateTo('/pages/profile/paymentPsw2')
					}
				}
			},
			async getUpdate() {
				let res = await this.$myRequest({
					url: 'update',
					data: {
						version: this.version,
						device: this.device
					}
				});
				if (res.data.code == 200) {
					if(res.data.data.update) {
						try {
							update.check();
						} catch (e) {
							
						};
					}else {
						_toast('当前版本无需更新');
					}
				}
			},
			btnClick() {
				uni.showModal({
					content: "是否要退出登录",
					success: (res) => {
						if (res.confirm) {
							this.$store.commit('logOut');
							uni.reLaunch({
								url: '/pages/login/login'
							})
						} else {

						}
					}
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
		.item {
			height: 100rpx;

		}

		.buttom {
			height: 100upx;
		}
	}
</style>
