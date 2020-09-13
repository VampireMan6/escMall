<template>
	<view class="container p-16 b-b">
		<view class="column" v-for="(item,i) in dataList" :key="i">
			<view>
				<text class="f-w-600">密保问题{{i+1}}: {{item}}</text>
			</view>
			<view v-if="i == 0" style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
				<input type="text" v-model="a1" class="flex_1" placeholder="请输入答案">
				<image v-if="a1" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q1')"></image>
			</view>
			<view v-if="i == 1" style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
				<input type="text" v-model="a2" class="flex_1" placeholder="请输入答案">
				<image v-if="a2" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q2')"></image>
			</view>
			<view v-if="i == 2" style="height: 96rpx;margin: 20rpx 0 40rpx;" class="b-F9F b-r-10 p-x-10 b-b j-center f-between">
				<input type="text" v-model="a3" class="flex_1" placeholder="请输入答案">
				<image v-if="a3" src="../../static/images/pro_17.png" mode="" class="image-15" @tap="delectText('q3')"></image>
			</view>
		</view>
		<view v-if="show" class="column">
			<input-self2 text="新支付密码" :account="psw" @delect="delect('psw')">
				<input slot="input" :password="rep_password1" placeholder="请输入8-20位的新支付密码" maxlength="20" type="text" class="flex_1" v-model="psw">
				<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('psw')" :src="'../../static/images/'+ rep_eyes_name1 +'.png'"></image>
			</input-self2>
			<view style="height: 50rpx;"></view>
			<input-self2 text="确认新支付密码" :account="pswSure" @delect="delect('pswSure')">
				<input slot="input" :password="rep_password2" placeholder="请确认新支付密码" maxlength="20" type="text" class="flex_1" v-model="pswSure">
				<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('pswSure')" :src="'../../static/images/'+ rep_eyes_name2 +'.png'"></image>
			</input-self2>
			<view style="height: 50rpx;"></view>
			<btn-self text="确认" :state="true" @btnClick="btnClick"></btn-self>
		</view>
	</view>
</template>

<script>
	import inputSelf2 from '@/components/input2'
	import { _toast } from '@/common/js/funs'
	import {	mapState	} from 'vuex'
	
	export default {
		onLoad() {
			this.getMiBao();
		},
		data() {
			return {
				oldpsw: "",
				psw: "",
				pswSure: "",
				rep_eyes_name: "pro_18",
				rep_password: true,
				rep_eyes_name1: "pro_18",
				rep_password1: true,
				rep_eyes_name2: "pro_18",
				rep_password2: true,
				dataList: [],
				a1: "",//答案
				a2: "",
				a3: "",
				show: false,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		components: {
			inputSelf2
		},
		methods: {
			async getMiBao() {
				let res = await this.$myRequest({
					url: 'user/security_question',
					message: "加载中",
					data: {
						username: this.userInfo.username
					}
				});
				if(res.data.code == 200) {
					let list = [];
					list.push(res.data.data.q1);
					list.push(res.data.data.q2);
					list.push(res.data.data.q3);
					this.dataList = list;
					this.show = true;
				}
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
				if(i == 'psw') {
					this.psw = ""
				} else {
					this.pswSure = ""
				}
			},
			hide_show(i) {
				if(i == 'psw') {
					if (this.rep_password1) {
						this.rep_eyes_name1 = "pro_19"
					} else {
						this.rep_eyes_name1 = "pro_18"
					}
					this.rep_password1 = !this.rep_password1;
				}else {
					if (this.rep_password2) {
						this.rep_eyes_name2 = "pro_19"
					} else {
						this.rep_eyes_name2 = "pro_18"
					}
					this.rep_password2 = !this.rep_password2;
				}
			},
			btnClick() {
				if(!this.a1) {
					_toast('密保1问题不能为空');
					return
				};
				if(!this.a2) {
					_toast('密保2问题不能为空');
					return
				};
				if(!this.a3) {
					_toast('密保3问题不能为空');
					return
				};
				if(!this.psw) {
					_toast('支付密码不能为空');
					return
				};
				if(this.psw.length < 8) {
					_toast('支付密码字符不能小于8');
					return
				};
				if(this.psw !== this.pswSure) {
					_toast('两次输入的支付密码不一致');
					return
				};
				this.getChagne();
			},
			async getChagne() {
				let res = await this.$myRequest({
					url: 'pay_password/forget/security_question',
					method: 'POST',
					message: "提交中",
					data: {
						user_id: this.userInfo.id,
						a1: this.a1,
						a2: this.a2,
						a3: this.a3,
						pay_password: this.psw,
						pay_password2: this.pswSure
					}
				});
				if(res.data.code == 200) {
					_toast('设置成功');
					setTimeout(()=> {
						uni.navigateBack()
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
