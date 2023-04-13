/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-28 20:10:48
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-13 20:42:16
 * @FilePath: /wxapp-boilerplate/src/store/reservation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { observable, action } from 'mobx-miniprogram';


export const reservationStore = observable({
	showReservationList: true, // 是否展示预约列表
	noReservation: false, // 没有预约列表
	doneReserList: [], //已预约列表
	cancelReserList: [],  // 取消预约列表
	/**
	 * 隐藏新增预约组件
	 */
	hideAddReservation: action(function () {
		this.showReservationList = true;
		this.noReservation = false;
		this.reservationRecord();
		console.log(this);
	}),
	/**
	 * 添加新预约
	 */
	addNewReservation: action(function () {
		this.showReservationList = false;
		this.noReservation = false;
	}),

	/**
	 * 获取预约记录									
	 */
	reservationRecord: action(async function (swiperTabCheckIndex = 0) {
		try {
			const app = getApp();
			const apis = app.apis;
			const isReserving = swiperTabCheckIndex === 0;
			const { code, data: lists = [] } = await apis.RESERVATION_RECORD({ isReserving });
			if (code === 200) {
				if (isReserving) {
					this.doneReserList = lists;
					this.noReservation = lists.length === 0;
					this.showReservationList = lists.length !== 0
				} else {
					this.cancelReserList = lists
				}

			}
		} catch (err) {
			console.log(`查询预约记录err:`, err);
		}
	}),
	// async reservationRecord() {
	// 	try {
	// 		const app = getApp();
	// 		const apis = app.apis;
	// 		const { swiperTabCheckIndex } = this.data || {};
	// 		const isReserving = swiperTabCheckIndex === 0;
	// 		const { code, data: lists = [] } = await apis.RESERVATION_RECORD({ isReserving });
	// 		if (code === 200) {
	// 			if (isReserving) {
	// 				this.setData({
	// 					doneReserList: lists,
	// 					noReservation: lists.length === 0,
	// 					showReservationList: lists.length !== 0
	// 				})
	// 			} else {
	// 				this.setData({
	// 					cancelReserList: lists
	// 				})
	// 			}

	// 		}
	// 	} catch (err) {
	// 		console.log(`查询预约记录err:`, err);
	// 	}

	// },
});
