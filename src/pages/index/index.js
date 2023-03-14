/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-14 20:43:04
 * @FilePath: /wxapp-boilerplate/src/pages/index/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { indexBehavior } from "./behavior";

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef


Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		swiperHeight: 0,
		swiperTab: [{
			name: '摩旅路书'
		}, {
			name: "事故分析"
		}],
		swiperTabCheckIndex: 0,
	},
	behaviors: [indexBehavior],
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		});
	},
	async onLoad() {
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
			this.getTabBarHeight(this);
		}
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
			this.getTabBarHeight(this)
		};
		this.setSwiperHeight(this.data.swiperTabCheckIndex)
	},
	/**
	 * 动态设置swiper高度
	 * @param {索引} index 
	 */
	setSwiperHeight(index) {
		let query = wx.createSelectorQuery().in(this);
		const that = this;
		query.select(`.swiper-${index}`).boundingClientRect().exec((res) => {
			that.setData({
				swiperHeight: res[0].height
			})
		});

	},
	/**
	 * 点击切换tab
	 * @param {} e 
	 */
	checkSwiperTab(e) {
		const { target: { dataset: { index: swiperTabCheckIndex = 0 } = {} } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex
		});
		this.setSwiperHeight(swiperTabCheckIndex)
	},
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex
		})
		this.setSwiperHeight(swiperTabCheckIndex)
	},
});
