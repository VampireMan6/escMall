<template>
	<view class="container">
		<!-- 顶部选项 -->
		<view class="top column p-x-16 b-b">
			<view class="f-between j-center b-F9F b-r-15 b-b m-b-10" style="padding: 32rpx 20rpx;">
				<view class="j-center" @tap="select('type')">
					<text>{{selectType}}</text>
					<image :class="typeState?'is-rotate':''" class="m-l-5 transition" style="width: 16rpx;height: 12rpx;" src="../../../static/images/pro_20.png" mode=""></image>
				</view>
				<view class="j-center" @tap="select('coin')">
					<text>{{selectCoin}}</text>
					<image :class="coinState?'is-rotate':''" class="m-l-5 transition" style="width: 16rpx;height: 12rpx;" src="../../../static/images/pro_20.png" mode=""></image>
				</view>
			</view>
			<!-- 月份选择 -->
			<view class="f-between j-center m-b-10">
				<view class="b-b b-F9F j-center" style="padding: 10rpx 20rpx;border-radius: 50rpx;">
					<picker mode="multiSelector" :range="timesList" :value="timeIndex" @change="bindTimeChange" @tap="select('month')" @cancel="back('month')">
						<text>{{month}}月</text>
						<image class="m-l-5 transition" :class="monthState?'is-rotate':''" style="width: 24rpx;height: 24rpx;" src="../../../static/images/pro_21.png" mode=""></image>
					</picker>
				</view>
				<view class="column f-13 c-CCC">
					<text>入账折合 {{coinIn}}USDT</text>
					<text>出账折合 {{coinOut}}USDT</text>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<scroll-view scroll-y="true" class="b-r-10" :style="{ height: scroll + 'px' }" @scrolltolower="loadMore">
			<view class="b-b w-100" style="padding: 0 32rpx 68rpx;">
				<view class="column w-100 b-r-10">
					<view v-if="dataList.length !== 0" class="column b-F9F b-b m-b-10" style="padding: 20rpx 10rpx 0;">
						<view class="f-between b-w b-b b-r-10 m-b-10" style="padding: 10rpx 20rpx;" v-for="(item,i) in dataList" :key="i">
							<view class="f-w-600 column">
								<text>{{item.coin_name}}</text>
								<text>{{item.type_text}}</text>
							</view>
							<view class="j-center f-w-600">
								<text>{{item.tx_type}} {{item.amount}}</text>
								<!-- <text class="c-CCC f-13">160000.000000USDT</text> -->
							</view>
						</view>
					</view>
					<view v-if="noData" class="column j-center">
						<image style="width: 120rpx;height: 108rpx;margin: 200rpx 0 32rpx;" src="../../../static/images/home_9.png" mode=""></image>
						<text class="f-14 c-CCC">什么都没有哦~</text>
					</view>
					<view v-if="noMore" class="f-center f-13">没有更多的数据~</view>
					<view v-if="loading" class="f-center f-13">加载中...</view>
				</view>
			</view>
		</scroll-view>
		<!-- 交易类型 -->
		<uni-popup ref="pop_type" type="bottom" text="type" @close="close('type')">
			<view class="pop_type b-w column">
				<view class="f-between j-center w-100" style="height: 130rpx;">
					<i class="uni-btn-icon c-1F1" style="font-size: 27px;" @tap="back('type')"></i>
					<text class="f-18 f-w-600">交易类型</text>
					<view style="width: 54rpx;"></view>
				</view>
				<view class="f-w p-16 b-b">
					<view v-for="(item,i) in typeList" :key="i">
						<view class="b-b b-r-5 f-w-600" 
						:class="i == tabClick_type?'b-1A8 c-w':'b-F9F c-b'" style="padding: 20rpx 40rpx;margin: 0 20rpx 30rpx 0;" @tap="type(i)">{{item.name}}</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 币种选择 -->
		<uni-popup ref="pop_coin" type="bottom" text="coin" @close="close('coin')">
			<view class="pop_coin b-w column">
				<view class="f-between j-center w-100" style="height: 130rpx;">
					<i class="uni-btn-icon c-1F1" style="font-size: 27px;" @tap="back('coin')"></i>
					<text class="f-18 f-w-600">选择币种</text>
					<view style="width: 54rpx;"></view>
				</view>
				<scroll-view scroll-y="true" style="height: 590rpx;padding-bottom: 68upx;" class="b-b">
					<view class="column p-x-16 b-b">
						<view :class="i==tabClick_coin?'border_1A8':'border_fff'" class="b-F9F b-r-5 b-b f-between j-center m-b-10" style="padding: 14rpx 20rpx;" 
						v-for="(item,i) in coinList" :key="i" @tap="coin(i)">
							<view class="j-center">
								<image v-if="item.image" class="image-30 b-r-50" :src="item.image" mode=""></image>
								<image v-else class="image-30 b-r-50" src="../../../static/images/pro_15.png" mode=""></image>
								<text class="m-l-10">{{item.CoinName}}</text>
							</view>
							<image v-if="i == tabClick_coin" class="image-15 b-r-50" src="../../../static/images/pro_15.png" mode=""></image>
							<view v-else class="image-15 b-r-50 b-w"></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<!-- 时间选择 -->
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import { dataTime } from '@/common/js/getTime.js'
	
	export default {
		onLoad() {
			this.coinList = uni.getStorageSync('coinList');
			this.getCoinType();
			this.dataTime = dataTime();
			this.month = this.dataTime[1] + 1;
			this.start_year = this.dataTime[0];
			this.timesList[0] = this.dataTime[2];
			this.getMesLogs();
			this.getConvert();
		},
		data() {
			return {
				selectType: "全部",
				selectCoin: "币种",
				dataTime: [],
				typeState: false,//类型列表
				coinState: false,//币种列表
				monthState: false,
				month: 0,
				dataList: [],//获取的数据列表
				tabClick_type: 0,
				tabClick_coin: 0,
				tabClick_month: 0,
				typeList: [{id:0,name:'全部'}],
				coinList: [],//币种列表
				timesList: [[],[1,2,3,4,5,6,7,8,9,10,11,12]],//时间列表
				timeIndex: [],
				coin_id: "",
				type_id: "",
				page: 1,
				start_year: "",
				copyTypeList: [],
				noData: false,
				noMore: false,
				loading: false,
				in: 0,
				out: 0
			}
		},
		components: {
			uniPopup
		},
		computed: {
			...mapState(['scrollHeight']),
			scroll() {
				return this.scrollHeight - uni.upx2px(308);
			},
			month_state() {//是不是闰年
				if(this.start_year%4 == 0 && this.start_year%100 !== 0 || this.start_year%400 ==0) {
					return true
				}else {
					return false
				}
			},
			start_time() {//起始时间
				return this.start_year.toString() +'-'+ this.month.toString() +'-'+ '01' + ' 0:0:0';
			},
			coinIn() {
				return parseFloat(this.in).toFixed(4)
			},
			coinOut() {
				return parseFloat(this.out).toFixed(4)
			},
			end_time() {
				let day = 31;
				let monthList = [1,3,5,7,8,10,12];
				let index = monthList.findIndex(x=>x == this.month);
				if(this.month_state) {//是闰年， 2月份为 29天	
					if(this.month == 2) {//2月
						day = 29;
						return this.start_year.toString() +'-'+ this.month.toString() +'-'+ day.toString() + ' 59:59:59';
					}else if(index !== -1) {//是31天
						day = 31
					}else {
						day = 30
					}
					return this.start_year.toString() +'-'+ this.month.toString() +'-'+ day.toString() + ' 59:59:59';
				}else {
					if(this.month == 2) {//2月
						day = 28;
						return this.start_year.toString() +'-'+ this.month.toString() +'-'+ day.toString() + ' 59:59:59';
					}else if(index !== -1) {//是31天
						day = 31
					}else {
						day = 30
					}
					return this.start_year.toString() + this.month.toString() + day.toString() + ' 59:59:59';
				}
			}
		},
		methods: {
			async getCoinType() {//币种类型
				let res = await this.$myRequest({
					url: 'coins/logs/types'
				});
				if(res.data.code == 200) {		
					this.copyTypeList = res.data.data;
					this.typeList =  this.typeList.concat(res.data.data);
				}
			},
			async getConvert() {
				let res = await this.$myRequest({
					url: 'coins/logs/convert',
					data: {
						coin_id: this.coin_id,
						type_id: this.type_id,
						tx_type: 0,
						start_time: this.start_time,
						end_time: this.end_time,
						page: this.page,
						count: 20
					}
				});
				if(res.data.code == 200) {
					this.in = res.data.data.in;
					this.out = res.data.data.out;
				}
			},
			async getMesLogs(options) {//充提日志
				let message = "加载中";
				if(options == 'loading') {
					message = "";
				}
				let res = await this.$myRequest({
					url: 'coins/logs',
					message: message,
					data: {
						coin_id: this.coin_id,
						type_id: this.type_id,
						tx_type: 0,
						start_time: this.start_time,
						end_time: this.end_time,
						page: this.page,
						count: 20
					}
				});
				if(res.data.code == 200) {	
					this.loading = false;
					let total = res.data.data.total;
					if(total == 0) {
						this.noData = true;
						this.dataList = [];
						this.noMore = false;
						return
					};
					this.dataList = [...this.dataList,...res.data.data.data];
					this.noData = false;
					if(this.dataList.length < total) {
						this.noMore = false;
					}else {
						this.noMore = true;
					};
					this.dataList.forEach((item,i)=> {
						item.amount = parseFloat(item.amount).toFixed(4);
					 	let index = this.copyTypeList.findIndex(x=>x.id == item.type_id);
						item.type_text = this.copyTypeList[index].name;
					});
				}
			},
			loadMore() {
				if(!this.noMore) {
					this.page ++
					this.getMesLogs("loading");
					this.getConvert();
				}
			},
			select(options) {//选择
				if(options == 'type') {
					this.typeState = true;
					this.$refs.pop_type.open();
				}else if(options == 'coin') {
					this.coinState = true;
					this.$refs.pop_coin.open();
				}else {
					this.monthState = true;
				}
			},
			back(options) {//遮罩层取消
				if(options == 'type') {
					this.$refs.pop_type.close();
					this.typeState = false;
				}else if(options == 'coin') {
					this.$refs.pop_coin.close();
					this.coinState = false;
				}else {
					this.monthState = false;
				}
			},
			close(options) {//关闭遮罩层
				if(options == 'type') {
					this.$refs.pop_type.close();
					this.typeState = false;
				}else {
					this.$refs.pop_coin.close();
					this.coinState = false;
				}
			},
			type(i) {//类型选择
				this.tabClick_type = i;
				if(i == 0) {
					this.type_id = "";
				}else {
					this.type_id = this.typeList[i].id
				};
				this.selectType = this.typeList[i].name;
				this.page = 1;
				this.dataList = [];
				this.noMore = false;
				this.getMesLogs();
				this.getConvert();
				this.close('type')
			},
			coin(i) {//币种选择
				this.tabClick_coin = i;
				this.coin_id = this.coinList[i].CoinId;
				this.selectCoin = this.coinList[i].CoinName;
				this.page = 1;
				this.dataList = [];
				this.noMore = false;
				this.getMesLogs();
				this.getConvert();
				this.close('coin')
			},
			bindTimeChange(e){
				this.timeIndex = e.target.value;
				this.monthState = false;
				this.start_year = this.timesList[0][this.timeIndex[0]];
				this.month = this.timesList[1][this.timeIndex[1]];
				this.page = 1;
				this.dataList = [];
				this.noMore = false;
				this.getMesLogs();
				this.getConvert();
			},
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.container {
		.top {
			height: 220rpx;
		}
		.is-rotate {
		  transform: rotate(180deg);
		}
		.pop_type {
			height: 900rpx;
			width: 100vw;
			border-radius: 50rpx 50rpx 0 0;
		}
		.pop_coin {
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
