<template>
	<view class="container p-16 b-b">
		<input-self2 text="旧密码" :account="oldpsw" @delect="delect('oldpsw')">
			<input slot="input" :password="rep_password" placeholder="请输入旧密码" maxlength="20" type="text" class="flex_1" v-model="oldpsw">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('oldpsw')" :src="'../../static/images/'+ rep_eyes_name +'.png'"></image>
		</input-self2>
		<view style="height: 50rpx;"></view>
		<input-self2 text="新密码" :account="psw" @delect="delect('psw')">
			<input slot="input" :password="rep_password1" placeholder="请输入8-20位新密码" type="text" class="flex_1" v-model="psw">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('psw')" :src="'../../static/images/'+ rep_eyes_name1 +'.png'"></image>
		</input-self2>
		<view style="height: 50rpx;"></view>
		<input-self2 text="重复新密码" :account="pswSure" @delect="delect('pswSure')">
			<input slot="input" :password="rep_password2" placeholder="请确认新密码" type="text" class="flex_1" v-model="pswSure">
			<image slot="pass" class="eyes_image m-l-10" @tap="hide_show('pswSure')" :src="'../../static/images/'+ rep_eyes_name2 +'.png'"></image>
		</input-self2>
		<view style="height: 50rpx;"></view>
		<btn-self text="更改" :state="true" @btnClick="btnClick"></btn-self>
	</view>
</template>

<script>
	import inputSelf2 from '@/components/input2'
	import { _toast } from '@/common/js/funs'
	
	export default {
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
			}
		},
		components: {
			inputSelf2
		},
		methods: {
			delect(i) {
				if (i == 'oldpsw') {
					this.oldpsw = "";
				} else if (i == 'psw') {
					this.psw = ""
				} else {
					this.pswSure = ""
				}
			},
			hide_show(i) {
				if (i == 'oldpsw') {
					if (this.rep_password) {
						this.rep_eyes_name = "pro_19"
					} else {
						this.rep_eyes_name = "pro_18"
					}
					this.rep_password = !this.rep_password;
				} else if(i == 'psw') {
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
				if(!this.oldpsw) {
					_toast('旧密码不能为空');
					return
				};
				if(this.oldpsw.length < 8) {
					_toast('旧密码位数不能小于8');
					return
				};
				if(this.psw.length < 8) {
					_toast('新密码位数不能小于8');
					return
				};
				if(this.psw !== this.pswSure) {
					_toast('两次输入的密码不一致');
					return
				};
				this.getChagne();
			},
			async getChagne() {
				let res = await this.$myRequest({
					url: 'password/change',
					method: 'POST',
					message: "修改中",
					data: {
						old_password: this.oldpsw,
						password: this.psw,
						password2: this.pswSure
					}
				});
				if(res.data.code == 200) {
					_toast('修改完成');
					setTimeout(()=> {
						uni.navigateBack()
					},1000)
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
