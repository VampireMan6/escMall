import Vue from 'vue'
import Vuex from 'vuex'
import myRequest from '../common/js/api.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	state:{//全局保存的值
		statusBarH: 0,//状态栏高度
		scrollHeight: 0,//屏幕高度
		haslogin: false,//登录状态
		userToken: {},//用户登录信息
		userInfo: {},//用户信息
		addressList: [],//地址列表
		coinList: [],//币种列表
	},
	getters:{//只是用来装饰state中的值，不能去改变state中的值
		
	},
	mutations:{//唯一能更改state中的值
		getStatusBarH(state,options) {
			state.statusBarH = options
		},
		getScrollHeight(state,options) {
			state.scrollHeight = options
		},
		getAddressList(state,options) {
			state.addressList = options
		},
		getState(state) {
			state.haslogin = true;
		},
		logIn(state,provider) {//登录token
			state.haslogin = true;
			state.userToken = provider;
			uni.setStorage({
				key: "userToken",
				data: provider
			})
		},
		logOut(state) {//退出账号
			state.haslogin = false;
			uni.clearStorage();
		},
		getUserInfo(state,userInfo) {//用户信息
			state.userInfo = userInfo;
			uni.setStorage({
				key: "userInfo",
				data: userInfo
			})
		},
		getCoinList(state,coinList) {//币种信息
			state.coinList = coinList;
			uni.setStorage({
				key: "coinList",
				data: coinList
			})
		}
	},
	actions:{//异步地 调用 mutations 去更改state中的对应值
		setUserInfo(context) {
			myRequest({
				url: 'user'
			})
			.then(res => {
				context.commit('getUserInfo', res.data.data);
			})
			.catch(err => {
				
			})
		},
		setCoinInfo(context) {
			myRequest({
				url: 'user/coins'
			})
			.then(res => {
				 context.commit('getCoinList', res.data.data)
			})
			.catch(err => {
				
			})
		},
	}
})
export default store