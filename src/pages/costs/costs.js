/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-18 09:27:56
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-09 13:20:23
 * @FilePath: /wxapp-boilerplate/src/pages/costs/costs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
import { throttle } from '@/utils/lodash-fix';

const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
Page({
	data: {
		costsLists: [{
			name: '了解我们',
			moduleCode: 'COLLECT_FEES',
		}, {
			name: '俱乐部收费',
			moduleCode: 'COLLECT_FEES',
		}, {
			name: '培训收费',
			moduleCode: 'TRAIN_FEES',
		}, {
			name: '场地列表',
			moduleCode: 'SITE_LIST',
		}],
		swiperTabCheckIndex: 0,
	},
	onLoad() {
		this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
	},
	/**
   * 获取安架科目
   */
	async getSubjectList({moduleCode}) {
		const { code, data: modulesInfo = {} } = await apis.GET_MODULE_CONTENT({ moduleCode, pageNum: 1, pageSize: 1000 });
		if (code === 200) {
			this.setData({
				modulesInfo,
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
		this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
	},
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex,
		});
		this.getSubjectList(this.data.costsLists[this.data.swiperTabCheckIndex]);
	},
});
