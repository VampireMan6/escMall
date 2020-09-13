<template>
	<view class="container">
		<scroll-view scroll-y="true" class="column" :style="{ height: scroll + 'px'}">
			<view class="column p-x-16 b-b">
				<view :class="item.is_default?'border_1':'border_2'" class="b-b b-r-15 m-b-10 b-F9F j-center" style="padding: 20upx;" 
				v-for="(item,i) in addressList" :key="i" @tap="select(i)">
					<view class="flex_1 column">
						<view class="j-center">
							<text class="c-1A8 f-w-600">{{item.name}}</text>
							<text class="m-l-5">{{item.tel}}</text>
							<text v-if="item.is_default" class="f-10 c-1A8 m-l-10">默认</text>
						</view>
						<text class="f-13 f-w-600">{{item.province}} {{item.city}} {{item.county}} {{item.address}}</text>
					</view>
					<image class="image-15" src="../../../static/images/home_5.png" mode="" @tap.stop="modify(i)"></image>
				</view>
				<view v-if="show" class="column j-center">
					<image style="width: 120rpx;height: 108rpx;margin: 200rpx 0 32rpx;" src="../../../static/images/home_9.png" mode=""></image>
					<text class="f-14 c-CCC">请新增地址哦~</text>
				</view>
			</view>
		</scroll-view>
		<view class="p-x-16 b-b w-100">
			<btnSelf class="w-100" text="新增地址" :state="true" @btnClick="btnClick"></btnSelf>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	
	export default {
		onLoad() {
			this.getUserList();
		},
		onShow() {
			let addressSetUp = uni.getStorageSync('addressSetUp');
			if(addressSetUp) {
				this.getUserList();
				uni.removeStorage({
					key: 'addressSetUp'
				})
			}
		},
		data() {
			return {
				tabClick: 0,
				addressList: [],
				show: false
			}
		},
		computed: {
			...mapState(['scrollHeight']),
			scroll() {
				return this.scrollHeight - uni.upx2px(266)
			}
		},
		methods: {
			async getUserList() {//收货地址列表
				let res = await this.$myRequest({
					url: 'user/address/list',
					message: "加载中"
				});
				if(res.data.code == 200) {
					this.addressList = res.data.data;
					if(this.addressList.length == 0) {
						this.show = true;
					}else {
						this.show = false;
					}
				}
			},
			select(i) {
				this.tabClick = i;
				uni.setStorage({
					key: 'selectAddress',
					data: this.addressList[this.tabClick]
				});
				uni.navigateBack({})
			},
			btnClick() {//新增地址
				uni.navigateTo({
					url: '/pages/home/address/newAddress'
				})
			},
			modify(i) {//修改地址信息
				uni.setStorage({
					key: 'editAddress',
					data: this.addressList[i]
				});
				uni.navigateTo({
					url: '/pages/home/address/newAddress'
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
		.border_1 {
			border: 2upx solid #1A87F5;
		}
		.border_2 {
			border: 2upx solid #FFFFFF;
		}
	}
</style>
