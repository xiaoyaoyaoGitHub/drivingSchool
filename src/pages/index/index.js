/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-10 20:58:14
 * @FilePath: /wxapp-boilerplate/src/pages/index/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { flow } from 'lodash';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		tabbarHeight: wx.getStorageSync('tabBarHeight'),
		swiperHeight: 0,
		swiperTab: [{
			name: '摩旅路书'
		}, {
			name: "事故分析"
		}],
		swiperTabCheckIndex: 0,
	},
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		});
	},
	async onLoad() {
		await delay();
		// 调用应用实例的方法获取全局数据
		app.getUserInfo((userInfo) => {
			// 更新数据
			this.setData({ userInfo });
		});
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
		}
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
			this.getTabbarHeight();
		}
		console.log(this.setSwiperHeight(0));
	},
	/**
	 * 获取底部自定义tabbar高度
	 */
	getTabbarHeight() {
		if (wx.getStorageSync('tabBarHeight')) {
			this.setData({
				tabbarHeight: wx.getStorageSync('tabBarHeight'),
			});
			return;
		}
		var obj = this.getTabBar().createSelectorQuery();
		const that = this;
		obj.select('.tab-bar').boundingClientRect(function (rect) {
			console.log('获取tabBar元素的高度', rect.height);
			const tabbarHeight = rect.height * (wx.getSystemInfoSync().pixelRatio);
			that.setData({
				tabbarHeight,
			});
			wx.setStorageSync('tabBarHeight', tabbarHeight); // 将获取到的高度设置缓存，以便之后使用
		}).exec();
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
	checkSwiperTab(e) {
		const { target: { dataset: { index: swiperTabCheckIndex = 0 } = {} } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex
		})
	},
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex
		})

	},
});
