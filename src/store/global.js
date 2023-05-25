
/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:04:24
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-25 13:44:06
 * @FilePath: /wxapp-boilerplate/src/store/global.js
 * @Description: 全局状态数据
 */
import { observable, action } from 'mobx-miniprogram';
import moment from "moment"

export const global = observable({
	tabBarHeight: 0, // 底部tabBar高度
	titleHeight: 0, // 标题栏高度
	statusBarHeight: 0, // 状态栏高度
	systemInfo: {}, // 系统信息
	userInfo: {},
	// userInfo: { token: "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjUzYjAxNDMwLWQ0YzMtNDM4My1iZDM1LTNiNWY4OTI4Mzc5OSJ9.pLt-EWSNdRoUwtiqzW2rjdjAjXUqwcSWLtns2Pc1IlkZ1qbJj2SQCeYHqqssRL6bg66SFFt9LGiHB-AH1453FA", memberId: 5 },
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
		console.log(`obj`, obj);
		obj.select('.tab-bar').boundingClientRect((rect) => {
			console.log(`rect`, rect);
			console.log('获取tabBar元素的高度', rect.height);
			const tabBarHeight = rect.height;
			this.tabBarHeight = tabBarHeight;
			wx.setStorageSync('tabBarHeight', tabBarHeight); // 将获取到的高度设置缓存，以便之后使用
		}).exec();
	}),
	/**
	 * 更新tabbar高度
	 */
	updateTabbarHeight: action(function (tabBarHeight) {
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
	 * 是否已登录
	 */
	get isLogin() {
		return !!this.userInfo.memberId
	},
	/**
	 * 是否为付费会员
	 */
	get isPayVip() {
		return false
		return +this.userInfo.isVip === 0
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
			wx.stopPullDownRefresh();
			if (code === 200) {
				info.trackMemberDays = moment(info.trackMemberEndDate).diff(moment(), 'day')
				info.trackMemberEndDate = moment(info.trackMemberEndDate).format('YYYY年MM月DD日');
				info.registerDate = moment(info.registerDate).format('YYYY年MM月DD日');
				info.safeDriverDays = moment(info.safeDriverEndDate).diff(moment(), 'day')
				info.safeDriverEndDate = moment(info.safeDriverEndDate).format('YYYY年MM月DD日');
				info.createDate = moment(info.createDate).format('YYYY年MM月DD日')
				info.updateDate = moment(info.updateDate).format('YYYY年MM月DD日')
				this.userInfo = { ...this.userInfo, ...info }
			} else if (code === 401) {
				this.removeToken();
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
	refreshToken({ token, memberId } = {}) {
		const key = 'TOKEN'
		if (token) {
			this.userInfo = { token, memberId };
			wx.setStorage({
				key,
				data: { token, memberId }
			})
		} else {
			console.log(`wx.getStorageSync({key: 'TOKEN'})`, wx.getStorageSync(key));
			this.userInfo = wx.getStorageSync(key);
		}

	},
	/**
	 * token失效,清楚数据
	 * @param {string} key 
	 */
	removeToken(key = 'TOKEN') {
		this.userInfo = {};
		wx.removeStorage({ key: key })
	},
});
