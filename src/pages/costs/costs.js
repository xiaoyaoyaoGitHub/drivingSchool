/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-18 09:27:56
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-22 17:36:04
 * @FilePath: /wxapp-boilerplate/src/pages/costs/costs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import { throttle } from '@/utils/lodash-fix';
const MODULE_CODE = { CAPRICORN_INTRO: "CAPRICORN_INTRO", COLLECT_FEES: "COLLECT_FEES", TRAIN_FEES: "TRAIN_FEES", SITE_LIST: "SITE_LIST" };
const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
Page({
	data: {
		costsLists: [{
			name: '',
			moduleCode: 'CAPRICORN_INTRO',
		}, {
			name: '',
			moduleCode: 'COLLECT_FEES',
		}, {
			name: '',
			moduleCode: 'TRAIN_FEES',
		}, {
			name: '',
			moduleCode: 'SITE_LIST',
		}],
		swiperTabCheckIndex: 0,
		CAPRICORN_INTRO: [], // 了解我们
		COLLECT_FEES: [], // 俱乐部收费
		TRAIN_FEES: [], // 培训收费
		SITE_LIST: [], // 场地列表
	},
	onLoad() {
		this.getModuleBanner();
		this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
	},
	/**
	 * 获取tab下数据
	 */
	async getSubjectList({ moduleCode }) {
		const { code, data: modulesInfo = {} } = await apis.GET_MODULE_CONTENT({ moduleCode, pageNum: 1, pageSize: 1000 });
		if (code === 200) {
			if (modulesInfo.length) {
				const itemList = (modulesInfo[0]).itemList || [];
				itemList.forEach((element) => {
					// 视频类型
					if (element.itemType === 2) {
						const firstGroup = element.videoPath.split('.html');
						const items = firstGroup[0].split('/');
						element.vid = items[items.length - 1];
					}
				});
				this.setData({
					[moduleCode]: itemList,
				});
			}
			else {
				this.setData({
					[moduleCode]: [],
				});
			}

		}
	},
	async getModuleBanner() {
		const { CAPRICORN_INTRO, COLLECT_FEES, TRAIN_FEES, SITE_LIST } = MODULE_CODE || {};
		const { code, data: modulesInfo = {} } = await apis.GET_MODULE_BANNER({ moduleCodes: `${CAPRICORN_INTRO},${COLLECT_FEES},${TRAIN_FEES},${SITE_LIST}` });
		if (code === 200) {
			this.setData({
				modulesInfo,
				'costsLists[0].name': modulesInfo[this.data.costsLists[0].moduleCode].moduleName,
				'costsLists[1].name': modulesInfo[this.data.costsLists[1].moduleCode].moduleName,
				'costsLists[2].name': modulesInfo[this.data.costsLists[2].moduleCode].moduleName,
				'costsLists[3].name': modulesInfo[this.data.costsLists[3].moduleCode].moduleName
			})
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
		}, () => {
			this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
		});

	},
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex,
		}, () => {
			this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
		});

	},
});
