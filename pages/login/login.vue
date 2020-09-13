<template>
	<view class="container p-x-16 b-b">
		<view style="height: 100rpx;"></view>
		<input-self1 text="账号" :account="account" @delect="delect('account')">
			<input slot="input" type="text" placeholder="请输入账号" class="flex_1" v-model="account">
		</input-self1>
		<view style="height: 50rpx;"></view>
		<input-self2 text="密码"  :account="psw" @delect="delect('psw')">
			<input slot="input" :password="rep_password" placeholder="请输入密码" type="text" class="flex_1" v-model="psw">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('rep_psw')" :src="'../../static/images/'+ rep_eyes_name +'.png'"></image>
		</input-self2>
		<view class="f-end c-1A8 f-14" style="margin-top: 10rpx;" @tap="forget">忘记密码?</view>
		<view class="f-w-600 m-b-10">验证</view>
		<move-verify @result='verifyResult' ref="verifyElement"></move-verify>
		<view style="height: 100rpx;"></view>
		<btn-self text="登录" :state="true" @btnClick="btnClick"></btn-self>
		<view class="f-w-600 f-18 c-1A8 f-center" style="margin-top: 30rpx;" @tap="enterReg">注册</view>
	</view>
</template>

<script>
	import inputSelf1 from '@/components/input1'
	import inputSelf2 from '@/components/input2'
	import moveVerify from "@/components/helang-moveVerify/helang-moveVerify.vue"
	import { _toast } from '@/common/js/funs'
	
	export default {
		data() {
			return {
				account: "",
				psw: "",
				rep_eyes_name: "pro_18",
				rep_password: true,
				verification: false
			}
		},
		components: {
			inputSelf1,
			inputSelf2,
			moveVerify
		},
		methods: {
			delect(i) {
				if(i == 'account') {
					this.account = "";
				}else {
					this.psw = ""
				}
			},
			hide_show() {
				if(this.rep_password) {
					this.rep_eyes_name = "pro_19"
				}else {
					this.rep_eyes_name = "pro_18"
				}
				this.rep_password = !this.rep_password;
			},
			enterReg() {//进入 注册
				uni.navigateTo({
					url: '/pages/login/register'
				})
			},
			verifyResult(res) {
				if(res.flag) {
					this.verification = true;
				}else {
					this.verification = false;
				}
			},
			btnClick() {//登录
				if(!this.account) {
					_toast('账户名不能为空');
					return
				};
				if(!this.psw) {
					_toast('登录密码不能为空');
					return
				};
				if(!this.verification) {
					_toast('请通过验证操作');
					return
				}
				this.login();
			},
			async login() {
				let res = await this.$myRequest({
					url: 'login',
					message: "登录中",
					method: 'POST',
					data: {
						account_number: this.account,
						password: this.psw
					}
				});
				if(res.data.code == 200) {
					uni.setStorage({
						key: 'userToken',
						data: res.data.data
					});
					this.$store.commit('logIn',res.data.data);//用户token
					// this.$store.dispatch('setUserInfo');//用户信息
					// this.$store.dispatch('setCoinInfo');//币种信息
					_toast('登录成功');
					setTimeout(()=> {
						uni.switchTab({
							url: '/pages/home/home'
						})
					},1000)
				}else {
					_toast(res.data.message);
				}
			},
			forget() {//忘记密码
				uni.navigateTo({
					url: '/pages/profile/forgetPsw2'
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
		.eyes_image {
			width: 34rpx;
			height: 26rpx;
		}
	}
</style>
