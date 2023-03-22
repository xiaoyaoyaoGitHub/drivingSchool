/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-22 22:40:27
 * @FilePath: /wxapp-boilerplate/src/pages/index/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { indexBehavior } from "./behavior";

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
const MODULE_CODE = {
	CAPRICORN_INTRO: 'CAPRICORN_INTRO', //魔杰座介绍
	SAFE_DRIVING_SUBJECT: "SAFE_DRIVING_SUBJECT", //安驾科目
	MEMBER_PRODUCT: " MEMBER_PRODUCT", //会员商品
	USED_CAR: "USED_CAR", //二手车
	TRAVEL_GUIDE: "TRAVEL_GUIDE", //摩旅路书
	ACCIDENT_ANALYSIS: "ACCIDENT_ANALYSIS" // 事故分析
}

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
		modulesInfo: {}, // 首页模块信息
		moduleContent: {}, // 模块内容信息
	},
	behaviors: [indexBehavior],
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		});
	},
	async onLoad() {
		this.getModuleBanner();
		// 摩旅路书
		this.getModuleContent({ moduleCode: MODULE_CODE.TRAVEL_GUIDE });
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
		
	},
	/**
	 * 动态设置swiper高度
	 * @param {索引} index 
	 */
	setSwiperHeight(index) {
		let query = wx.createSelectorQuery().in(this);
		const that = this;
		query.select(`.swiper-${index}`).boundingClientRect().exec((res) => {
			console.log(`res`,res);
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
	/**
	 * 滑动底部swiper
	 * @param {*} e 
	 */
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex
		})
		this.setSwiperHeight(swiperTabCheckIndex)
	},
	/**
	 * 获取banner图（首页解摩羯座，安驾科目，会员商品，二手好车的banner图从这里获取）									
	 */
	async getModuleBanner() {
		const { CAPRICORN_INTRO, SAFE_DRIVING_SUBJECT, MEMBER_PRODUCT, USED_CAR, TRAVEL_GUIDE, ACCIDENT_ANALYSIS } = MODULE_CODE || {};
		const { code, data: modulesInfo = {} } = await apis.GET_MODULE_BANNER({ moduleCodes: `${CAPRICORN_INTRO},${SAFE_DRIVING_SUBJECT},${MEMBER_PRODUCT},${USED_CAR},${TRAVEL_GUIDE},${ACCIDENT_ANALYSIS}` });
		if (code === 200) {
			this.setData({
				modulesInfo
			})
		}
	},
	/**
	 * 获取模块内容
	 * @param {*} moduleCode 模块名称
	 */
	async getModuleContent({ moduleCode }) {
		const { code, data: modulesContent = {} } = await apis.GET_MODULE_CONTENT({ moduleCode });
		if (code === 500) {
			const moduleName = `moduleContent.${moduleCode}`;
			this.setData({
				[moduleName]: modulesContent
			},() => {
				this.setSwiperHeight(this.data.swiperTabCheckIndex)
			})
		}
	},
});
