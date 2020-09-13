<template>
	<view class="container">
		<view class="column fixed z-1 w-100 b-b">
			<!-- 顶部状态栏 -->
			<view class="b-w" :style="{ height: statusBarH + 'px' }"></view>
			<view class="w-100 f-between j-center b-w b-b" style="height: 88upx;padding-right: 32upx;">
				<view style="width: 100rpx;" @tap="back"><i class="uni-btn-icon c-1F1" style="font-size: 27px;"></i></view>
				<view class="f-16 c-1F1 flex_1 f-center" style="font-weight: 700;">分享应用</view>
				<view class="f-13"></view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="b-b" style="padding-bottom: 68rpx;" :style="{ height: scrolleight + 'px',marginTop: content_top + 'px'}">
			<view class="column w-100 p-x-16 b-b">
				<!-- 滑动 -->
				<scroll-view scroll-x="true" class="scroll m-b-30">
					<view class="">
						<view :class="i" class="item column relative z-1" v-for="(item,i) of dataList" :key="i" @tap="select(i)">
							<image class="bckimage relative z-2" :src="item.image" mode=""></image>
							<image v-if="i == tabClick" class="image-15 absolute z-999" style="top: 10rpx;right: 10rpx;" src="../../static/images/home-11.png"
							 mode=""></image>
							<view class="bottom p-10 b-b w-100 absolute z-3">
								<image class="image-40" :src="item.image2" mode=""></image>
								<view class="column flex_1 m-l-5">
									<text class="c-w f-13 m-b-5">科恩矿机</text>
									<text class="c-CCC f-10">邀请码: {{invite_code}}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="m-b-40 text">{{text}}</view>
				<view class="column j-center w-100" v-if="show">
					<view class="button j-center f-center b-r-5 b-F9F f-18 c-808" style="width: 300rpx;height: 100rpx;margin-bottom: 100rpx;"
					 @tap="copy">复制文字</view>
					<view class="f-between w-100">
						<view class="flex_1 column j-center" @tap="copys">
							<image class="image-30 m-b-5" src="../../static/images/pro_28.png" mode=""></image>
							<text class="f-w-600">复制链接</text>
						</view>
						<view class="flex_1 column j-center" @tap="preserve">
							<image class="image-30 m-b-5" src="../../static/images/pro_29.png" mode=""></image>
							<text class="f-w-600">保存图片</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="shows" class="bottom_image b-b fixed z-999">
			<view class="column j-center f-center w-100 h-100 absolute z-1">
				<image class="w-100 h-100 relative z-2" :src="dataList[tabClick].image" mode=""></image>
				<view class="bottom b-b w-100 absolute z-3 p-16 b-b" style="bottom: 0;">
					<image class="image-erweima" :src="dataList[tabClick].image2" mode=""></image>
					<view class="column f-center flex_1 m-l-10 b-b" style="padding: 40rpx 0;">
						<text class="c-w m-b-20 f-18">科恩矿机</text>
						<text class="c-CCC f-18">邀请码: {{invite_code}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QR from "@/common/js/wxqrcode.js"
	import mantle from '@/components/mantle.vue'
	import { url,share_url } from '@/common/js/api'
	
	export default {
		onLoad() {
			try {
				let res = uni.getSystemInfoSync();
				this.statusBarH = res.statusBarHeight;
				this.scrolleight = res.windowHeight - this.statusBarH - uni.upx2px(88);
				this.content_top = this.statusBarH + uni.upx2px(88);
			} catch (e) {
				// error
			};
			this.getShare();
			let userInfo = uni.getStorageSync('userInfo');
			this.invite_code = userInfo.invite_code;
		},
		data() {
			return {
				statusBarH: 0,
				scrolleight: 500,
				content_top: 44,
				dataList: [],
				tabClick: 0,
				text: "",
				invite_code: "",
				show: false,
				shows: false
			}
		},
		components: {
			mantle
		},
		methods: {
			funs() {//截屏
				var bitmap = null;
				const currentWebview = this.$mp.page.$getAppWebview();
				bitmap = new plus.nativeObj.Bitmap();
				// 将webview内容绘制到Bitmap对象中
				let _self = this;
				currentWebview.draw(bitmap, function() {
					// console.log('截屏绘制图片成功');
					bitmap.save("_doc/a.jpg", {}, function(i) {
						// console.log('保存图片成功：' + JSON.stringify(i));
						uni.saveImageToPhotosAlbum({
							filePath: i.target,
							success: function() {
								bitmap.clear(); //销毁Bitmap图片
								uni.showToast({
									title: '保存图片成功',
									mask: false,
									duration: 1000
								});
								_self.shows = false;
							}
						});
					}, function(e) {
						_self.shows = false;
						// console.log('保存图片失败：' + JSON.stringify(e));
					});
				}, function(e) {
					_self.shows = false;
					// console.log('截屏绘制图片失败：' + JSON.stringify(e));
				});
			},
			async getShare() {
				let res = await this.$myRequest({
					url: 'share',
					message: "加载中"
				});
				if (res.data.code == 200) {
					this.dataList = res.data.data.posters_background;
					this.dataList.forEach((item, i) => {
						let image = QR.createQrCodeImg( share_url + '?invite=' + this.invite_code, {
							size: parseInt(300)
						})
						item.image2 = image;
					})
					this.text = res.data.data.posters_copywriting;
					this.show = true;
				}
			},
			back() {
				uni.navigateBack({})
			},
			preserve() {//保存图片
				this.shows = true;
				setTimeout(()=> {
					this.funs();
				},500)
			},
			select(i) {//选择图片
				this.tabClick = i;
			},
			cancel() {
				this.shows = false;
			},
			copy() {
				uni.setClipboardData({
					data: this.text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				});
			},
			copys() {
				let str = '';
				str = share_url + '?invite=' + this.invite_code;
				uni.setClipboardData({
					data: str,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1000,
							mask: true
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}

	.container {
		.scroll {
			height: 600rpx;

			.item {
				width: 300rpx;
				margin-right: 10rpx;

				.bckimage {
					width: 300rpx;
					height: 600rpx;
					border-radius: 20rpx;
				}

				.bottom {
					height: 120rpx;
					border-radius: 0 0 20rpx 20rpx;
					bottom: 0;
				}
			}
		}
		.bottom_image {
			height: 100vh;
			width: 100vw;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #000000;
			// .image {
			// 	width
			// 	height: 960rpx;
			// }
			.bottom {
				.image-erweima {
					width: 200rpx;
					height: 200rpx;
				}
			}
		}
	}
</style>
