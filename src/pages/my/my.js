/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-09 11:29:09
 * @FilePath: /wxapp-boilerplate/src/pages/logs/logs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { behavior } from './behavior';

const app = getApp();
const apis = app.apis;

Page({
	data: {
		logs: [],
	},
	behaviors: [behavior],
	onLoad() {
		this.getTabBarHeight();

	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2,
			});
		}
		this.getMemberDetail();
		apis.ADD_COMPLAIN();
		apis.ADD_CAR_NUMBER();
		apis.SET_EMERGENCY_PHONE();
	},
	/**
	 * 获取用户详情
	 */
	async getMemberDetail() {
		const { memberId } = this.data.userInfo || {};
		const {code, msg} = await apis.GET_MEMBER_DETAIL({memberId});
		if (code === 200) {

		}
		else {

		}
		console.log(res);
	},
});
