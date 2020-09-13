<template>
	<view class="container p-16 b-b">
		<view class="b-b b-F9F column b-r-5" style="margin-bottom: 30upx;" v-for="(item,i) in dataList" :key="i" @tap="select(i)">
			<view class="f-between j-center" style="padding: 30upx 20upx;">
				<view class="f-w-600">{{i+1}}. {{item.text}}</view>
				<image :class="item.state?'is-rotate':''" class="transition image-18" src="../../static/images/pro_27.png" mode=""></image>
			</view>
			<view v-show="item.state" class="b-b c-999 f-13 transition" style="padding: 0 20upx 30upx 48upx ;">{{item.content}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getArticles();
		},
		data() {
			return {
				state: false,
				tabClick: 999,
				dataList: []
			}
		},
		methods: {
			async getArticles() {
				let res = await this.$myRequest({
					url: 'articles',
					message: "加载中",
					data: {
						category_ids: 1
					}
				});
				if(res.data.code == 200) {
					let list = res.data.data.data;
					list.forEach((item,i)=> {
						let obj = {}
						obj.text = item.content;
						obj.content = item.description;
						obj.state = false;
						this.dataList.push(obj);
					})
				}
			},
			select(i) {
				if(this.dataList[i].state == true) {
					this.dataList[i].state = false;
				}else {
					this.dataList.forEach(item=>{
						item.state = false;
					});
					this.dataList[i].state = !this.dataList[i].state;
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
		.is-rotate {
		  transform: rotate(180deg);
		  // transform: rotateY(130deg);
			// transform: rotateX(180deg);
		}
	}
</style>
