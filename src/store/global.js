
/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:04:24
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-09 09:46:59
 * @FilePath: /wxapp-boilerplate/src/store/global.js
 * @Description: 全局状态数据
 */
import { observable, action } from 'mobx-miniprogram';

export const global = observable({
	tabBarHeight: 0, // 底部tabBar高度
	titleHeight:0, // 标题栏高度
	statusBarHeight: 0, // 状态栏高度
	systemInfo:{}, // 系统信息
	userInfo:{token:"eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6Ijg4MDZjNDk3LTFiNjQtNGU3ZS1hMzVmLTNlYjk3MjQ3NWQ5NSJ9.M2rYIZVzNgUaBUIHe34TbaOsxBtOkoxXEmE4tXFrCVvxmtOWK1QFU4SVd6F-qOPIuylOkNRNKchET1EWZ7zh4Q",memberId:35},
	/**
     * 获取底部自定义tabBar高度
	 * @param {callee} 当前页面实例
     */
	getTabBarHeight: action(function (callee) {
		if (wx.getStorageSync('tabBarHeight')) {
			this.tabBarHeight = wx.getStorageSync('tabBarHeight');
			return;
		};
		var obj = callee.getTabBar().createSelectorQuery();
		obj.select('.tab-bar').boundingClientRect((rect) => {
			console.log('获取tabBar元素的高度', rect.height);
			const tabBarHeight = rect.height;
			this.tabBarHeight = tabBarHeight;
			wx.setStorageSync('tabBarHeight', tabBarHeight); // 将获取到的高度设置缓存，以便之后使用
		}).exec();
	}),
	/**
	 * 顶部透明占位高度
	 */
	get transparentHeight() {
		return this.titleHeight + this.statusBarHeight
	},
	get totalHeight(){
		return this.systemInfo.screenHeight - this.tabBarHeight
	},
	/**
	 * 获取 状态栏+ 标题栏的高度
	 */
	getTitleBarAndStatusBarHeight() {
		console.log(`wx.getSystemInfoSync()`, wx.getSystemInfoSync());
		const systemInfo = wx.getSystemInfoSync();
		const { statusBarHeight, screenHeight, windowHeight } = systemInfo || {};
		const titleHeight = screenHeight - windowHeight;
		this.systemInfo = systemInfo;
		// 标题栏高度
		this.titleHeight = titleHeight;
		// 状态栏高度
		this.statusBarHeight = statusBarHeight;
	},
	/**
	 * 获取用户信息
	 */
	getUserInfo(){
		
	},
	/**
	 * 更新token
	 */
	refreshToken({token, memberId}){
		console.log(`token`,token);
		this.userInfo = {token, memberId}
	},
	
});
