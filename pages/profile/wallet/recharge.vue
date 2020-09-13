<template>
	<view class="container p-x-16 b-b">
		<select-coin :select_text="select_text" @select="enterSelect">
			<image slot="image" class="image-30 b-r-50" :src="coinImage" mode=""></image>
		</select-coin>
		<view class="column j-center b-F9F b-b" style="margin: 60rpx 0 160rpx;border-radius: 20rpx;padding: 100rpx 20rpx;">
			<image :src="images" style="width: 260upx;height: 260upx;margin-bottom: 80rpx;" mode=""></image>
			<view style="padding: 20rpx 36rpx;border-radius: 50rpx;word-wrap:word-break;word-break:break-all;" class="b-b b-w m-b-10">{{address_text}}</view>
			<!-- <view class="f-13">该地址仅支持{{select_text}}币种充值，最低充值数量{{minNumber}}{{select_text}}</view> -->
			<view class="f-13">{{RechargeInfo}}</view>
		</view>
		<btnSelf text="复制地址" :state="true" @btnClick="btnClick"></btnSelf>
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
								<image v-else class="image-30 b-r-50 b-1A8" src="../../../static/images/pro_15.png" mode=""></image>
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
	import QR from "@/common/js/wxqrcode.js"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { _toast } from '@/common/js/funs'
	
	export default {
		onLoad() {
			this.coinList = uni.getStorageSync('coinList');
			this.select_text = this.coinList[0].CoinName;
			this.coinImage = this.coinList[0].image;
			this.address_text = this.coinList[0].Address;
			this.minNumber = this.coinList[0].chongZhiMin;
			this.RechargeInfo = this.coinList[0].RechargeInfo;
			this.images =  QR.createQrCodeImg(this.select_text +','+ this.address_text, { size: parseInt(300) });
		},
		components: {
			selectCoin,
			uniPopup
		},
		data() {
			return {
				select_text: "",
				images: "",
				address_text: "",
				coinList: [],
				tabClick: 0,
				RechargeInfo: ""
			}
		},
		methods: {
			enterSelect() {//选择列表弹出
				this.$refs.pop.open()
			},
			btnClick() {
				uni.setClipboardData({
					data: this.address_text,
					success: ()=> {
						_toast('复制成功')
					}
				})
			},
			back() {//关闭遮罩层
				this.$refs.pop.close()
			},
			select(i) {
				this.tabClick = i;
				this.select_text = this.coinList[i].CoinName;
				if(this.coinList[i].image) {
					this.coinImage = this.coinList[i].image;
				}else {
					this.coinImage = '../../../static/images/pro_15.png';
				}
				this.address_text = this.coinList[i].Address;
				this.minNumber = this.coinList[i].chongZhiMin;
				this.RechargeInfo = this.coinList[i].RechargeInfo;
				this.images =  QR.createQrCodeImg(this.select_text +','+ this.address_text +',', { size: parseInt(300) });
				this.close();
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
