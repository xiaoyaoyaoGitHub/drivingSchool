/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-18 09:27:56
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-18 09:42:43
 * @FilePath: /wxapp-boilerplate/src/pages/costs/costs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
Page({
	data: {
		costsLists: [{
			name: '了解我们',
		}, {
			name: '俱乐部收费',
		}, {
			name: '培训收费',
		}, {
			name: '场地列表',
		}],
		swiperTabCheckIndex: 0,
	},
	onLoad() {},
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
