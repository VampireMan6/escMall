<template>
	<view class="container p-16 b-b j-center">
		<image class="image-60 b-r-50 m-b-40" :src="userInfo.avatar?userInfo.avatar:'../../static/images/pro_2.png'" mode="" @tap="uploadAvator"></image>
		<view>点击头像可修改图片</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { _toast } from '@/common/js/funs'
	
	export default {
		onLoad() {
			this.getQnToken();
		},
		data() {
			return {
				qnToken: '',
				qnUrl: ''
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			async getQnToken() {
				let res = await this.$myRequest({
					url: 'upload/token'
				});
				if(res.data.code == 200) {
					this.qnToken = res.data.data.token;
					this.qnUrl = res.data.data.upload_url;
				}
			},
			uploadAvator(){
				uni.chooseImage({
					count: 1,
					success: chooseRes => {
						const tempFilePaths = chooseRes.tempFilePaths;
						uni.showLoading({
							title: "上传中"
						});
						uni.uploadFile({
							url: this.qnUrl,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {token: this.qnToken},
							success: res => {
								if(res.statusCode == 200){
									if (typeof res.data == "string") res.data = JSON.parse(res.data);
									uni.hideLoading();
									this.getEdit(res.data.key);//修改头像
								}else{
									uni.hideLoading();
									_toast('上传失败')
								}
							},
							fail: (err) => {
								uni.hideLoading();
								_toast('上传失败')
							}
						})
					}
				});
			},
			async getEdit(avator) {
				let res = await this.$myRequest({
					url: 'user/edit',
					method: "POST",
					data: {
						avatar: avator
					}
				});
				if(res.data.code == 200) {
					_toast('设置成功')
					this.$store.dispatch('setUserInfo');//用户信息
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
		
	}
</style>
