/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-08 22:10:04
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-11 10:51:10
 * @FilePath: /wxapp-boilerplate/src/pages/appointment/appointment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp();

Page({
	data: {
		tabbarHeight: wx.getStorageSync('tabBarHeight'),
		totalHeight: '',
		appointmentStatus: [{
			name: '已预约 ',
		}, {
			name: '预约记录',
		}],
		swiperTabCheckIndex: 0,
		statusBarHeight: app.globalData.totalHeight,
	},
	onLoad() {
		// 设置当前 页面 总高度
		this.setData({
			totalHeight: wx.getSystemInfoSync().windowHeight - wx.getStorageSync('tabBarHeight'),
		});
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1,
			});
		}
	},
	/**
	 * 点击切换tab
	 * @param {} e
	 */
	checkSwiperTab(e) {
		const { target: { dataset: { index: swiperTabCheckIndex = 0 } = {} } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex,
		});
	},
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex,
		});

	},
});
