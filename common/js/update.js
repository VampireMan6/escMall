import { url } from './api.js'
import { _toast } from '@/common/js/funs' 

const check = () => {
	plus.runtime.getProperty(plus.runtime.appid, function(info) {
		let device = "";
		try {
		    const res = uni.getSystemInfoSync();
		   device = res.platform;
		} catch (e) {
		   
		};
		uni.request({
			url: url + 'update',
			data: {
				"version": info.version,
				"device": device
			},
			success: (res) => {
				if(res.statusCode == 200 && res.data.code == 200) {
					if(res.data.data.must) {//必须更新
						uni.showModal({
							title: "发现新版本,请更新APP",
							showCancel: false,
							success: (e) => {
								if (e.confirm) {
									plus.nativeUI.showWaiting("正在下載更新文件...");
									uni.downloadFile({
										url: res.data.data.url,
										success: result => {
											plus.nativeUI.closeWaiting();
											if(result.statusCode === 200){
												 plus.nativeUI.showWaiting("正在安裝更新文件...");
												 plus.runtime.install(result.tempFilePath, { force: true }, () => {
													 plus.nativeUI.closeWaiting();
													 plus.nativeUI.alert("应用更新完成！即將重啟",function(){
													     plus.runtime.restart();
													 });
												 }, () => { plus.nativeUI.closeWaiting(); _toast('更新失敗'); })
											}else{
												_toast('下载失敗');
											}
										},
										fail: err => { plus.nativeUI.closeWaiting(); _toast('下载失敗'); }
									})
								}
							}
						})
					}else if(res.data.data.update){//可选择更新
						uni.showModal({
							content: "是否更新app",
							success: (result1) => {
								if(result1.confirm) {
									plus.nativeUI.showWaiting("正在下載更新文件...");
									uni.downloadFile({
										url: res.data.data.url,
										success: result => {
											plus.nativeUI.closeWaiting();
											if(result.statusCode === 200){
												 plus.nativeUI.showWaiting("正在安裝更新文件...");
												 plus.runtime.install(result.tempFilePath, { force: false }, () => {
													 plus.nativeUI.closeWaiting();
													 plus.nativeUI.alert("应用更新完成！即將重啟",function(){
													     plus.runtime.restart();
													 });
												 }, () => { plus.nativeUI.closeWaiting(); _toast('更新失敗'); })
											}else{
												_toast('下载失敗');
											}
										},
										fail: err => { plus.nativeUI.closeWaiting(); _toast('下载失敗'); }
									})
								}
							}
						})
					}
				}else {
					_toast('网络异常，请检查网络后重新尝试')
				}
			},
			fail: (err) => {
				
			}
		})
	})
}

export default {
	check
}
