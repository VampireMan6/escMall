<template>
	<view class="container p-16 b-b">
		<input-self1 text="账号"  :account="account" @delect="delect('account')">
			<input slot="input" type="text" placeholder="用户名必须在5到20个字符之间" class="flex_1" v-model="account">
		</input-self1>
		<view style="height: 20rpx;"></view>
		<input-self2 text="密码" :account="psw" @delect="delect('psw')">
			<input slot="input" :password="rep_password" placeholder="请输入8-20位密码" maxlength="20" type="text" class="flex_1" v-model="psw">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('rep_psw')" :src="'../../static/images/'+ rep_eyes_name +'.png'"></image>
		</input-self2>
		<view style="height: 20rpx;"></view>
		<input-self2 text="重复密码" :account="pswSure" @delect="delect('pswSure')">
			<input slot="input" :password="rep_password1" placeholder="请重新输入一次密码" type="text" class="flex_1" v-model="pswSure">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('rep_pswSure')" :src="'../../static/images/'+ rep_eyes_name1 +'.png'"></image>
		</input-self2>
		<view style="height: 20rpx;"></view>
		<!-- 密保1 -->
		<picker class="w-100" mode="selector" :range="classifyList" @change="select_type1">
			<view class="w-100 f-between j-center">
				<view class="f-w-600">
					<text>密保1</text>
					<text class="c-333 m-l-10">{{classify1_text}}</text>
				</view>
				<image style="width: 36upx;height: 36upx;" src="../../static/images/pro_21.png" mode=""></image>
			</view>
		</picker>
		<view style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
			<input type="text" v-model="a1" class="flex_1" placeholder="请输入答案">
			<image v-if="a1" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q1')"></image>
		</view>
		<!-- 密保2 -->
		<picker class="w-100" mode="selector" :range="classifyList" @change="select_type2">
			<view class="w-100 f-between j-center">
				<view class="f-w-600">
					<text>密保2</text>
					<text class="c-333 m-l-10">{{classify2_text}}</text>
				</view>
				<image style="width: 36upx;height: 36upx;" src="../../static/images/pro_21.png" mode=""></image>
			</view>
		</picker>
		<view style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
			<input type="text" v-model="a2" class="flex_1" placeholder="请输入答案">
			<image v-if="a2" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q2')"></image>
		</view>
		<!-- 密保3 -->
		<picker class="w-100" mode="selector" :range="classifyList" @change="select_type3">
			<view class="w-100 f-between j-center">
				<view class="f-w-600">
					<text>密保3</text>
					<text class="c-333 m-l-10">{{classify3_text}}</text>
				</view>
				<image style="width: 36upx;height: 36upx;" src="../../static/images/pro_21.png" mode=""></image>
			</view>
		</picker>
		<view style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
			<input type="text" v-model="a3" class="flex_1" placeholder="请输入答案">
			<image v-if="a3" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q3')"></image>
		</view>
		<input-self1 text="邀请码"  :account="invite_code" @delect="delect('invite_code')">
			<input slot="input" type="text" placeholder="请输入邀请码" class="flex_1" v-model="invite_code">
		</input-self1>
		<view style="height: 50rpx;"></view>
		<view class="f-w-600 m-b-10">验证</view>
		<move-verify @result='verifyResult' ref="verifyElement"></move-verify>
		<view style="height: 100rpx;"></view>
		<btn-self text="注册" :state="true" @btnClick="btnClick"></btn-self>
		<view class="f-w-600 f-18 c-1A8 f-center" style="margin-top: 30rpx;" @tap="enterLogin">登录</view>
	</view>
</template>

<script>
	import inputSelf1 from '@/components/input1'
	import inputSelf2 from '@/components/input2'
	import moveVerify from "@/components/helang-moveVerify/helang-moveVerify.vue"
	import { _toast } from '@/common/js/funs'

	export default {
		onLoad() {
			this.getMiBao();
		},
		data() {
			return {
				account: "",
				psw: "",
				pswSure: "",
				invite_code: "",
				rep_eyes_name: "pro_18",
				rep_password: true,
				rep_eyes_name1: "pro_18",
				rep_password1: true,
				resultData: {},
				verification: false,
				classifyList: [],
				classifyId: [],
				classify1_text: "请选择密保问题",
				classify2_text: "请选择密保问题",
				classify3_text: "请选择密保问题",
				q1: "",//密保id
				q2: "",
				q3: "",
				a1: "",//答案
				a2: "",
				a3: "",
			}
		},
		components: {
			inputSelf1,
			inputSelf2,
			moveVerify
		},
		methods: {
			async getMiBao() {
				let res = await this.$myRequest({
					url: 'question'
				});
				if(res.data.code == 200) {
					let list = res.data.data;
					list.forEach((item,i)=> {
						this.classifyList.push(item.question);
						this.classifyId.push(item.id);
					});
				}
			},
			select_type1(e) {
				this.classify1_text = this.classifyList[e.detail.value];
				this.q1 = this.classifyId[e.detail.value];
			},
			select_type2(e) {
				this.classify2_text = this.classifyList[e.detail.value];
				this.q2 = this.classifyId[e.detail.value];
			},
			select_type3(e) {
				this.classify3_text = this.classifyList[e.detail.value];
				this.q3 = this.classifyId[e.detail.value];
			},
			delectText(i) {
				if(i == 'q1') {
					this.a1 = '';
				}else if(i == 'q2') {
					this.a2 = ''
				}else {
					this.a3 = ''
				}
			}, 
			delect(i) {
				if (i == 'account') {
					this.account = "";
				} else if (i == 'psw') {
					this.psw = ""
				} else if( i == 'pswSure' ){
					this.pswSure = ""
				}else {
					this.invite_code = ""
				}
			},
			hide_show(i) {
				if (i == 'rep_psw') {
					if (this.rep_password) {
						this.rep_eyes_name = "pro_19"
					} else {
						this.rep_eyes_name = "pro_18"
					}
					this.rep_password = !this.rep_password;
				} else {
					if (this.rep_password1) {
						this.rep_eyes_name1 = "pro_19"
					} else {
						this.rep_eyes_name1 = "pro_18"
					}
					this.rep_password1 = !this.rep_password1;
				}
			},
			verifyResult(res) {
				if(res.flag) {
					this.verification = true;
				}else {
					this.verification = false;
				}
			},
			enterLogin() {
				uni.navigateBack({})
			},
			btnClick() {//注册
				if(!this.account) {
					_toast('账户名不能为空');
					return
				};
				if(this.psw.length < 8) {
					_toast('密码位数不能小于8位');
					return
				};
				if(this.psw !== this.pswSure) {
					_toast('两次输入的密码不一致');
					return
				};
				if(this.classify1_text == '请选择密保问题') {
					_toast('请选择密保问题1');
					return
				};
				if(!this.a1) {
					_toast('密保1问题不能为空');
					return
				};
				if(this.classify2_text == '请选择密保问题') {
					_toast('请选择密保问题2');
					return
				};
				if(!this.a2) {
					_toast('密保2问题不能为空');
					return
				};
				if(this.classify3_text == '请选择密保问题') {
					_toast('请选择密保问题3');
					return
				};
				if(!this.a3) {
					_toast('密保3问题不能为空');
					return
				};
				if(this.q1 == this.q2 || this.q1 == this.q3 || this.q2 == this.q3) {
					_toast('密保问题有重复，请重新选择');
					return
				};
				if(!this.invite_code) {
					_toast('请填写邀请码');
					return
				};
				if(!this.verification) {
					_toast('请通过验证操作');
					return
				}
				this.register();
			},
			async register() {
				let res = await this.$myRequest({
					url: 'register/username',
					message: '注册中',
					method: 'POST',
					data: {
						username: this.account,
						password: this.psw,
						password2: this.pswSure,
						q1: this.q1,
						q2: this.q2,
						q3: this.q3,
						a1: this.a1,
						a2: this.a2,
						a3: this.a3,
						invite_code: this.invite_code
					}
				});
				if(res.data.code == 200) {
					uni.setStorage({
						key: 'userInfo',
						data: res.data.data
					});
					this.$store.commit('logIn',res.data.data);
					// this.$store.dispatch('setUserInfo');//用户信息
					// this.$store.dispatch('setCoinInfo');//币种信息
					_toast('注册成功');
					setTimeout(()=> {
						uni.switchTab({
							url: '/pages/home/home'
						})
					},1000)
				}else {
					_toast(res.data.message);
				}
			},
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
