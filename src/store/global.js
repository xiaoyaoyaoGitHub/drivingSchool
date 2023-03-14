/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:04:24
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-14 20:58:28
 * @FilePath: /wxapp-boilerplate/src/store/global.js
 * @Description: 全局状态数据
 */
import { observable, action } from 'mobx-miniprogram';

export const global = observable({
	tabBarHeight: 0, // 底部tabBar高度
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
});
