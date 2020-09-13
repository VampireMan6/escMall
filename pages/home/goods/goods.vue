<template>
	<view class="container">
		<scroll-view scroll-y="true" class="column" :style="{ height: scroll + 'px'}">
			<view class="b-F9F column top b-b">
				<!-- 轮播图 -->
				<swiper style="height: 600rpx;" :autoplay="true" :interval="3000" :duration="1000" :circular="true" :current="swiperCurrent" @change="changeSwiper">
					<swiper-item v-for="(item,i) in dataDetail.image" :key="i">
						<view class="f-center">
							<image class="w-100" style="height: 600rpx;" :src="item" mode=""></image>
						</view>
					</swiper-item>
				</swiper>
				<!-- 轮播指示点样式修改 -->
				<view class="dots f-center">
					<view class="m-l-10" v-for="(item,index) in swiperImg.length" :key="item">
						<view class="dot m-r-10 b-r-50" :class="index==swiperCurrent ? ' active' : ''"></view>
					</view>
				</view>
			</view>
			<view class="relative w-100">
				<view class="column content p-x-16 b-b absolute w-100">
					<!-- 简介信息 -->
					<view class="b-r-10 w-100 b-000 column b-b m-b-20" style="padding: 40rpx 30rpx;">
						<view class="f-between j-center m-b-5">
							<text class="f-18 c-w">{{dataDetail.name}}</text>
							<text class="f-13 c-808">重量:{{dataDetail.weight}}KG</text>
						</view>
						<text class="c-w m-b-20">算力:{{pow}}T</text>
						<view class="f-between j-center">
							<text class="c-1A8 f-18">{{price}}USDT</text>
							<view class="column f-10 c-808">
								<text>发布时间 : {{dataDetail.release_start_time.slice(0,10)}}</text>
							</view>
						</view>
					</view>
					<view class="f-between j-center b-F9F m-b-20" style="height: 100rpx;border-radius: 30rpx 30rpx 0 0;">
						<view class="flex_1 f-center f-w-600" v-for="(item,i) in dataList" :key="i" @tap="select(i)">
							<view :class="i == tabClick?'c-1A8':'c-b'">{{item}}</view>
						</view>
					</view>
					<rich-text v-if="tabClick == 0" :nodes="dataDetail.buy_tips"></rich-text>
					<rich-text v-if="tabClick == 1" :nodes="dataDetail.product_description"></rich-text>
					<rich-text v-if="tabClick == 2" :nodes="dataDetail.after_sales_policy"></rich-text>
					<view style="height: 40rpx;"></view>
				</view>
			</view>
		</scroll-view>
		<view class="f-between j-center buttom p-x-16 b-b">
			<view class="view b-F9F j-center b-b f-between" style="padding: 0 40rpx;">
				<text>数量</text>
				<image v-if="stopState" class="image-20" src="../../../static/images/home_1.png" mode="" @tap="shop('reduce')"></image>
				<image v-else class="image-20" src="../../../static/images/home_3.png" mode="" @tap="shop('reduce')"></image>
				<text>{{number}}</text>
				<image class="image-20" src="../../../static/images/home_2.png" mode="" @tap="shop('add')"></image>
			</view>
			<view class="view b-1A8 j-center f-center c-w f-w-600" @tap="enterOrder">立即购买</view>
		</view>
	</view>
</template>

<script>
	import { mapState }  from 'vuex'
	import { _toast } from '@/common/js/funs'
	 
	export default {
		onLoad() {
			let dataDetail = uni.getStorageSync('kjDetail');
			this.dataDetail = dataDetail;
			this.swiperImg = this.dataDetail.image;
			this.price = parseFloat(dataDetail.price).toFixed(4);
			this.pow = parseFloat(dataDetail.pow).toFixed(4);
		},
		onShow() {
			this.$store.dispatch('setUserInfo');//用户信息
			let number = uni.getStorageSync('shopNumber');
			if(number) {
				this.number = number;
				uni.removeStorage({
					key: 'shopNumber'
				});
				if(this.number == 1) {
					this.stopState = true;
				}else {
					this.stopState = false;
				}
			}
		},
		data() {
			return {
				swiperImg: [],
				dataDetail: [],
				swiperCurrent: 0,
				dataList: ['购买须知','产品介绍','售后政策'],
				tabClick: 0,
				number: 1,
				stopState: true,
			}
		},
		computed: {
			...mapState(['scrollHeight','haslogin']),
			scroll() {
				return this.scrollHeight - uni.upx2px(256)
			}
		},
		methods: {
			changeSwiper(e) { //轮播图
				this.swiperCurrent = e.detail.current;
			},
			select(i) {
				this.tabClick = i;
			},
			enterOrder() {
				if(!this.haslogin) {
					_toast('请先登录');
					setTimeout(()=> {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					},1000)
				}else {
					uni.navigateTo({
						url: ('/pages/home/goods/order?number=' + this.number)
					})
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
		.top {
			height: 800rpx;
			/* 轮播指示点样式 */
			.dots {
				margin-top: 40rpx;
				.dot {
					//未选中样式
					width: 12rpx;
					height: 12rpx;
					background-color: #000000;
					transition: all .6s;
					border-radius: 100%;
				}
				.active {
					//被选中样式
					background-color: #1A87F5;
				}
			}
		}
		.content {
			top: -104rpx;
		}
		.buttom {
			.view {
				width: 300rpx;
				height: 88rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
