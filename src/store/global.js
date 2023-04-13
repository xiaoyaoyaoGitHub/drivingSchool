
/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:04:24
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-13 22:39:57
 * @FilePath: /wxapp-boilerplate/src/store/global.js
 * @Description: 全局状态数据
 */
import { observable, action } from 'mobx-miniprogram';


export const global = observable({
	tabBarHeight: 0, // 底部tabBar高度
	titleHeight: 0, // 标题栏高度
	statusBarHeight: 0, // 状态栏高度
	systemInfo: {}, // 系统信息
	userInfo:{},
	// userInfo: { token: "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjZjNDU0Y2Y5LWIwN2EtNGU1MC04ZDY4LWQ5NTBhYjI1ZGZlOSJ9.4w6vnWBWt0u0jS0IW_5o3mI_MKj_aWiej_A-MUFRh8QlRYzVcQ954Z0b7rCA7_VIYHKpxtRv1usXDQLkBpCLIQ", memberId: 39 },
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
		console.log(`obj`,obj);
		obj.select('.tab-bar').boundingClientRect((rect) => {
			console.log(`rect`,rect);
			console.log('获取tabBar元素的高度', rect.height);
			const tabBarHeight = rect.height;
			this.tabBarHeight = tabBarHeight;
			wx.setStorageSync('tabBarHeight', tabBarHeight); // 将获取到的高度设置缓存，以便之后使用
		}).exec();
	}),
	/**
	 * 更新tabbar高度
	 */
	updateTabbarHeight:action(function(tabBarHeight){
		this.tabBarHeight = tabBarHeight;
		wx.setStorageSync('tabBarHeight', tabBarHeight); // 将获取到的高度设置缓存，以便之后使用
	}),
	/**
	 * 顶部透明占位高度
	 */
	get transparentHeight() {
		return this.titleHeight + this.statusBarHeight
	},
	/**
	 * 页面总高度
	 */
	get totalHeight() {
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
	async getUserInfo() {
		try {
			const app = getApp()
			const { memberId } = this.userInfo || {};
			const { code, data: info = {}, msg } = await app.apis.GET_MEMBER_DETAIL({ memberId });
			if (code === 200) {
				this.userInfo = { ...this.userInfo, ...info }
			}
			else {
				wx.showToast({
					title: msg,
					icon: 'none',
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
	/**
	 * 更新token
	 */
	refreshToken({ token, memberId }) {
		console.log(`token`, token);
		this.userInfo = { token, memberId }
	},
});
