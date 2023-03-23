/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-23 15:02:28
 * @FilePath: /wxapp-boilerplate/src/pages/index/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { indexBehavior } from "./behavior";
import { throttle } from '@/utils/lodash-fix';

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
			name: '摩旅路书',
			moduleCode: MODULE_CODE.TRAVEL_GUIDE
		}, {
			name: "事故分析",
			moduleCode: MODULE_CODE.ACCIDENT_ANALYSIS
		}],
		swiperTabCheckIndex: 0,
		modulesInfo: {}, // 首页模块信息
		moduleContent: [], // 模块内容信息
		anouncementList:[], // 公告
	},
	behaviors: [indexBehavior],
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		});
	},
	async onLoad() {
		// 上部区域模块
		this.getModuleBanner();
		// 摩旅路书
		this.getModuleContent();
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
		query.select(`.swiper`).boundingClientRect().exec((res) => {
			console.log(`res`, res);
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
		// 重新获取内容
		this.getModuleContent()
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
	 */
	async getModuleContent() {
		try {
			const { swiperTab, swiperTabCheckIndex } = this.data || {};
			const { moduleCode } = swiperTab[swiperTabCheckIndex] || {};
			console.log(`moduleCode`, moduleCode);
			const { code, data: moduleContent = {} } = await apis.GET_MODULE_CONTENT({ moduleCode });
			if (code === 200) {
				this.setData({
					moduleContent
				}, () => {
					// 设置swiper高度
					this.setSwiperHeight()
				})
			}
		} catch (err) {
			console.log(err);
		}
	},
	/**
	 * 点击文章详情
	 */
	articalDetail: throttle(function (e) {
		const { dataset: { target: { item: artical = {} } = {} } = {} } = e || {};
		const { articalId } = artical || {};
	}),
	/**
	 * 获取公告
	 */
	async getAnouncementsList(){
		try {
			const { code, anouncementList = [] } = await apis.GET_ANOUNCEMENTS_LIST();
			if(code === 200){
				this.setData({
					anouncementList
				})
			}
		}catch(err){
			console.log(`获取公告err:`,err);
		}
	},
});
