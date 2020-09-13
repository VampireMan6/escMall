<template>
	<view class="container p-16 b-b">
		<!-- 收货人 -->
		<view class="f-w-600 m-b-8">收货人</view>
		<view class="b-F9F b-b b-r-10 m-b-20" style="padding: 32rpx 20rpx;">
			<input type="text" placeholder="请输入收货人姓名" v-model="name" placeholder-class="f-15 c-CCC">
		</view>
		<!-- 手机号 -->
		<view class="f-w-600 m-b-8">手机号</view>
		<view class="b-F9F b-b b-r-10 m-b-20" style="padding: 32rpx 20rpx;">
			<input type="number" placeholder="请输入收货人手机号码" maxlength="11" v-model="phone" placeholder-class="f-15 c-CCC">
		</view>
		<!-- 收货地址 -->
		<view class="f-w-600 m-b-8">收货地址</view>
		<view class="b-F9F b-b b-r-10 m-b-8 flex" style="padding: 32rpx 20rpx;" @tap="handleTap('picker3')">
			<input disabled="true" type="text" class="flex_1" placeholder="请选择收货地址" v-model="address1" placeholder-class="f-15 c-CCC">
			<image class="image-20" src="../../../static/images/home_6.png" mode=""></image>
		</view>
		<!-- 详细地址 -->
		<view class="b-F9F b-b b-r-10 m-b-40" style="padding: 32rpx 20rpx;">
			<input type="text" class="flex_1" placeholder="请输入详细地址" v-model="address2" placeholder-class="f-15 c-CCC">
		</view>
		<!-- 默认地址 -->
		<view class="b-F9F b-b b-r-10 m-b-20 flex f-between j-center" style="padding: 12rpx 20rpx;">
			<view class="flex column">
				<text class="f-w-600 m-b-5">默认地址</text>
				<text class="f-10 c-CCC">每次下单都会选择默认地址</text>
			</view>
			<image v-if="defaultState" style="width: 54rpx; height: 30rpx;" src="../../../static/images/home_8.png" mode="" @tap="defaultAddress"></image>
			<image v-else style="width: 54rpx; height: 30rpx;" src="../../../static/images/home_7.png" mode="" @tap="defaultAddress"></image>
		</view>
		<btnSelf text="保存地址" :state="true" @btnClick="btnClick"></btnSelf>
		<!-- 城市选择弹出层 -->
		<lb-picker ref="picker3" v-model="value3" mode="multiSelector" :list="list" :level="3"  @change="handleChange"  @confirm="handleConfirm"  @cancel="handleCancel"></lb-picker>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { _toast,checkMobile } from '@/common/js/funs.js'
	import LbPicker from '@/components/lb-picker'
	import areaData from '@/common/js/area-data-min.js'
	
	export default {
		onLoad() {
			let editAddress = uni.getStorageSync('editAddress');
			if(editAddress) {
				this.name = editAddress.name;
				this.phone = editAddress.tel;
				this.address1 = editAddress.province + ' '+ editAddress.city +' '+ editAddress.county;
				this.address2 = editAddress.address;
				this.defaultState = editAddress.is_default;
				this.address_id = editAddress.id;
				this.state = false;
				uni.removeStorage({
					key: 'editAddress'
				})
			}
		},
		data() {
			return {
				name: "",
				phone: "",
				address1: "",
				address2: "",
				input: '',
				list: areaData,
				value3: [],
				defaultState: false,
				state: true,
			}
		},
		computed: {
			...mapState(['addressList'])
		},
		components: {
			LbPicker
		},
		methods: {
			btnClick() {
				if(!this.name) {
					_toast('请填写收货人姓名');
					return;
				};
				if(!this.phone) {
					_toast('请填写发货人手机号码');
					return;
				};
				if(!checkMobile(this.phone)) {
					_toast('手机号码格式不正确');
					return;
				};
				if(!this.address1) {
					_toast('请填写发货地址');
					return;
				};
				if(!this.address2) {
					_toast('请填写发货详细地址');
					return;
				};
				if(this.state) {
					this.addUserAddress();
				}else {
					this.getUpdateMes();
				}
			},
			async addUserAddress() {//添加地址
				let res = await this.$myRequest({
					url: 'user/address/add',
					method: 'POST',
					data: {
						name: this.name,
						tel: this.phone,
						province: this.address1.split(" ")[0],
						city: this.address1.split(" ")[1],
						county: this.address1.split(" ")[2],
						address: this.address2,
						is_default: this.defaultState
					}
				});
				if(res.data.code == 200) {
					uni.setStorage({
						key: 'addressSetUp',
						data: "state"
					});
					_toast('新增成功');
					setTimeout(()=> {
						uni.navigateBack({})
					},1000)
				}
			},
			async getUpdateMes() {//更新地址
				let res = await this.$myRequest({
					url: 'user/address/edit',
					method: 'POST',
					data: {
						address_id: this.address_id,
						name: this.name,
						tel: this.phone,
						province: this.address1.split(" ")[0],
						city: this.address1.split(" ")[1],
						county: this.address1.split(" ")[2],
						address: this.address2,
						is_default: this.defaultState
					}
				});
				if(res.data.code == 200) {
					uni.setStorage({
						key: 'addressSetUp',
						data: "state"
					});
					_toast('修改成功');
					setTimeout(()=> {
						uni.navigateBack({})
					},1000)
				}
			},
			handleChange (item) {
				
			},
			handleConfirm (item) {
				let list = item.item;
				let str = "";
				list.forEach(item=> {
					str += item.label + ' ';
				});
				this.address1 = str;
			},
			handleCancel (item) {
				
			},
			handleTap (picker) {
				this.$refs[picker].show()
			},
			defaultAddress() {
				this.defaultState = !this.defaultState;
				if(this.defaultState) {
					this.addressList.forEach((item,i)=> {
						this.addressList[i].default = false
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		
	}
</style>
