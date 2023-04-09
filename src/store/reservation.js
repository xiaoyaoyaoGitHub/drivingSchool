
import { observable, action } from 'mobx-miniprogram';

export const reservationStore = observable({
	showReservationList: true, // 是否展示预约列表
	noReservation: false, // 没有预约列表
	/**
	 * 隐藏新增预约组件
	 */
	hideAddReservation: action(function () {
		this.showReservationList = true;
		this.noReservation = false;
		console.log(this);
	}),
	/**
	 * 添加新预约
	 */
	addNewReservation: action(function () {
		this.showReservationList = false;
		this.noReservation = false;
	}),
});
