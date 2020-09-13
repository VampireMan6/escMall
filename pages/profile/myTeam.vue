<template>
	<view class="container p-x-16 b-b">
		<!-- 顶部选择 -->
		<view class="b-r-15 f-between j-center w-100 b-F9F top m-b-10">
			<view :class="i == tabClick?'c-1A8':''" class="flex_1  f-center f-w-600" v-for="(item,i) in topList" :key="i" @tap="select(i)">
				<view class="">{{item}}</view>
			</view>
		</view>
		<!-- 收益 -->
		<view class="profit b-r-15 f-between f-w-600 m-b-30">
			<view class="flex_1 column f-center j-center">
				<view class="c-CCC m-b-10">累计收益</view>
				<view class="c-w">{{totalNumber}}</view>
			</view>
			<view class="flex_1 column f-center j-center">
				<view class="c-CCC m-b-10">昨日收益</view>
				<view class="c-w">{{yesterdayNumber}}</view>
			</view>
		</view>
		<!-- 直推列表 -->
		<view class="f-between m-b-10">
			<view class="f-w-600">{{titleList[tabClick]}}</view>
			<view class="c-CCC f-13">共{{total}}人</view>
		</view>
		<!-- 列表 -->
		<view v-if="dataList.length !== 0" class="column b-F9F b-r-10 b-b m-b-10" style="padding: 20rpx 10rpx;">
			<view class="b-w b-b m-b-10 f-between" style="padding: 20rpx 10rpx;" v-for="(item,i) in dataList" :key="i">
				<!-- 左侧 -->
				<view class="j-center">
					<image class="image-30 b-r-50" src="../../static/images/pro_2.png" mode=""></image>
					<view class="m-l-10 column">
						<view>
							<text>{{item.username}}</text>
							<!-- <image style="width: 60rpx; height: 24rpx;" src="../../static/images/pro_13.png" mode=""></image> -->
						</view>
						<!-- <text class="c-CCC f-13">133****8965</text> -->
					</view>
				</view>
				<!-- 右侧 -->
				<view class="column" style="align-items: flex-end;">
					<text class="f-w-600">{{item.devote}}</text>
					<text class="f-13 c-CCC">{{item.created_at}}</text>
				</view>
			</view>
		</view>
		<view v-if="noData" class="column j-center">
			<image style="width: 120rpx;height: 108rpx;margin: 200rpx 0 32rpx;" src="../../static/images/home_9.png" mode=""></image>
			<text class="f-14 c-CCC">什么都没有哦~</text>
		</view>
		<view v-if="noMore" class="f-center f-13">没有更多的数据~</view>
		<view v-if="loading" class="f-center f-13">加载中...</view>
		<view style="height: 68rpx;"></view>
	</view>
</template>

<script>
	// import { yesterday } from '@/common/js/yesterday.js'
	import { mapState } from 'vuex'
	
	export default {
		onLoad() {
			this.getDataList();//直推列表
			// this.dataTime = yesterday;
		},
		data() {
			return {
				topList: ['直推','粉丝'],
				titleList: ['直推列表','粉丝列表'],
				tabClick: 0,
				dataList: [],
				page:1,
				urlList: ['invite','team'],
				total: 0,
				noMore: false,
				loading: false,
				noData: false,
			}
		},
		onReachBottom() {//上拉加载
			if(!this.noMore) {
				this.loading = true;
				this.page ++;
				this.getDataList('loading')
			}
		},
		computed: {
			...mapState(['userInfo']),
			totalNumber() {//总收益
				return parseFloat(this.userInfo.income_amount).toFixed(4);
			},
			yesterdayNumber() {//昨日收益
			return parseFloat(this.userInfo.income_yesterday).toFixed(4);
			}
		},
		methods: {
			async getDataList(options) {//直推、粉丝列表
				let message = '加载中'
				if(options == 'loading') {
					message = ''
				}
				let res = await this.$myRequest({
					url: 'user/' + this.urlList[this.tabClick],
					message,
					data: {
						count: 20,
						page: this.page
					}
				});
				if(res.data.code == 200) {
					this.total = res.data.data.total;
					if(this.total == 0) {
						this.noData = true;
						return
					};
					this.dataList = [...this.dataList,...res.data.data.data];
					this.noData = false;
					if(this.dataList.length < this.total) {
						this.noMore = false;
					}else {
						this.noMore = true;
					};
					this.dataList.forEach((item,i)=> {
						this.dataList[i].devote = parseFloat(item.devote).toFixed(4);
						this.dataList[i].created_at = item.created_at.slice(0,10);
					})
				}
			},
			select(i) {//直推、粉丝列表 切换
				this.tabClick = i;
				this.page = 1;
				this.noMore = false;
				this.noData = false;
				this.dataList = [];
				this.getDataList();
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
			height: 100rpx;
		}
		.profit {
			height: 220rpx;
			background-color: #000000;
		}
	}
</style>
