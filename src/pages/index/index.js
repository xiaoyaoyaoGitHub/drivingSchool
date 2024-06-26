/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-06-30 15:39:45
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
	MEMBER_PRODUCT: "MEMBER_PRODUCT", //会员商品
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
			name: '',
			moduleCode: MODULE_CODE.TRAVEL_GUIDE
		}, {
			name: "",
			moduleCode: MODULE_CODE.ACCIDENT_ANALYSIS
		}],
		noticeShowIndex: 0,
		swiperTabCheckIndex: 0,
		modulesInfo: {}, // 首页模块信息
		moduleContent: [], // 模块内容信息
		anouncementList: [], // 公告
		showNoticeContent: false, // 是否展示公告弹框
	},
	behaviors: [indexBehavior],
	// 事件处理函数
	loginTap: throttle(function () {
		wx.navigateTo({
			url: '/pages/costs/costs',
		});
	}),
	/**
	 * 支付VIP
	 */
	payVip: throttle(function () {
		wx.navigateTo({
			url: '/pages/payInfo/payInfo',
		});
	}),
	// 了解摩杰座
	goToCosts: throttle(function () {
		wx.navigateTo({
			url: '/pages/costs/costs',
		});
	}),
	/**
	 * 会员商品
	 */
	productList: throttle(function () {
		wx.navigateTo({
			url: '/pages/products/products',
		});
	}),
	/**
	 * 安架科目
	 */
	subjectList: throttle(function () {
		wx.navigateTo({
			url: '/pages/subjects/subjects',
		});
	}),
	/**
	 * 二手车
	 */
	productByUsed: throttle(function () {
		wx.navigateTo({
			url: '/pages/productsByUsed/productsByUsed'
		})
	}),

	onLoad() {

		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
			// this.getTabBarHeight(this);
			this.getTabBarFirst()
		}
	},
	async onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0,
			});
			// this.getTabBarHeight(this)
			this.getTabBarFirst()
		};
		// 上部区域模块
		await this.getModuleBanner();
		await this.getUserInfo();
		// 摩旅路书
		this.getModuleContent();
		this.getAnouncementsList();

	},
	// onPullDownRefresh() {
	// 	this.getUserInfo();

	// },
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
	 * 获取banner图（首页解摩杰座，安驾科目，会员商品，二手好车的banner图从这里获取）
	 */
	async getModuleBanner() {
		const { CAPRICORN_INTRO, SAFE_DRIVING_SUBJECT, MEMBER_PRODUCT, USED_CAR, TRAVEL_GUIDE, ACCIDENT_ANALYSIS } = MODULE_CODE || {};
		const { code, data: modulesInfo = {} } = await apis.GET_MODULE_BANNER({ moduleCodes: `${CAPRICORN_INTRO},${SAFE_DRIVING_SUBJECT},${MEMBER_PRODUCT},${USED_CAR},${TRAVEL_GUIDE},${ACCIDENT_ANALYSIS}` });
		if (code === 200) {
			this.setData({
				modulesInfo,
				'swiperTab[0].name': modulesInfo[this.data.swiperTab[0].moduleCode].moduleName,
				'swiperTab[1].name': modulesInfo[this.data.swiperTab[1].moduleCode].moduleName
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
					moduleContent,
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
		console.log(`e`, e);
		const { currentTarget: { dataset: { artical = {} } = {} } = {} } = e || {};
		console.log(`artical`, artical);
		// wx.navigateTo({
		// 	url:`/pages/productDetail/productDetail?info=${JSON.stringify(this.data.modulesInfo[index])}`
		//   })
		const info = encodeURIComponent(JSON.stringify(artical))
		wx.navigateTo({
			url: `/pages/articalDetail/articalDetail?info=${info}`
		})

	}),
	/**
	 * 获取公告
	 */
	async getAnouncementsList() {
		try {
			const { code, data: anouncementList = [] } = await apis.GET_ANOUNCEMENTS_LIST();
			if (code === 200) {
				anouncementList.forEach(element => {
					element.content = element.content.replace('\n', '')
				});
				this.setData({
					anouncementList
				})
				if (anouncementList.length && app.globalData.openNotice) {
					app.globalData.openNotice = false
					this.onShowNoticeContent();
				}
			}
		} catch (err) {
			console.log(`获取公告err:`, err);
		}
	},
	getTabBarFirst() {
		var obj = this.getTabBar().createSelectorQuery();
		console.log(`obj`, obj);
		obj.select('.tab-bar').boundingClientRect((rect) => {
			console.log(`rect`, rect);
			console.log('获取tabBar元素的高度', rect.height);
			const tabBarHeight = rect.height;
			this.updateTabbarHeight(tabBarHeight);
		}).exec();
	},
	/**
	 * 展示公告栏
	 */
	onShowNoticeContent: throttle(function (e) {
		const { detail: { index: noticeShowIndex = 0 } = {} } = e || {}

		this.setData({
			noticeShowIndex,
			showNoticeContent: !this.data.showNoticeContent
		})
	})
});
