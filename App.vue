<script>
	import update from '@/common/js/update.js'
	
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			try {
				update.check();
			} catch (e) {
				
			};
			// #endif
			try {//获得手机顶部状态栏、页面高度
			    let res = uni.getSystemInfoSync();
					this.$store.commit('getStatusBarH',res.statusBarHeight);//导航栏高度
					let height = res.windowHeight - res.statusBarHeight;//页面高度
					this.$store.commit('getScrollHeight',height);
			}catch (e) {
			    // error
			};
			let userToken = uni.getStorageSync('userToken');//token
			let userInfo = uni.getStorageSync('userInfo');//用户信息
			if(userToken) {
				this.$store.commit('logIn',userToken);
				this.$store.commit('getUserInfo',userInfo);
				uni.switchTab({
					url: '/pages/home/home'
				})
			};
			let list = uni.getStorageSync('addressList');//地址列表
			if(list) {
				this.$store.commit('getAddressList',list)
			}
		
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/common.css';
</style>
