const url = 'https://mill-api.escchain.org/' //app 正式网
// const url = 'http://esc.243.8kpay.com:8000/' //app  测试

const share_url = 'https://mill-h5.escchain.org/' //h5

const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		let message = options.message || ''; //显示加载提示
		if (message != '') {
			uni.showLoading({
				title: message,
				mask: true,
				duration: 800
			})
		};
		let data = options.data || {}; // 请求数据	
		let header = {
			'accept-language': 'zh_CN'
		};
		if (!options.header) {
			options.header = {};
		};
		let userToken = uni.getStorageSync('userToken');//获取token
		if (userToken) {
			header.Authorization = userToken.access_token;
		};
		uni.request({
			url: url + options.url,
			method: options.method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				if (message != '') {
					uni.hideLoading()
				};
				if (res.statusCode === 200) {
					resolve(res)
				}else if(res.statusCode === 401) {
					uni.showToast({
						title: '已过期，请重新登陆',
						icon: 'none',
						duration: 1000
					});
					uni.clearStorage();
					uni.reLaunch({
						url: '/pages/login/login',
					})
				}else {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none',
						duration: 1000
					})
				};
			},
			fail: (err) => {
				if (message != '') {
					uni.hideLoading()
				};
				uni.showToast({
					title: '网络异常，请检查网络后重新尝试',
					duration: 2000,
					icon: "none"
				})
				reject(err)
			}
		})
	})
}
export default myRequest

export {
	url,
	share_url
}
// async huandengpian() {
// 	let res = await this.$myRequest({
// 		url: '/api/index/slide',
// 		method: "POST",
// 	});
// 	console.log(res.data.data)
// },
