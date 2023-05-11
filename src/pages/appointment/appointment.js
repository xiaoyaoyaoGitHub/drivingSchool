/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-08 22:10:04
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-11 17:18:54
 * @FilePath: /wxapp-boilerplate/src/pages/appointment/appointment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { behavior } from './behavior';
import { throttle } from '@/utils/lodash-fix';

const app = getApp();
const apis = app.apis;

Page({
	data: {
		appointmentStatus: [{
			name: '已预约 ',
		}, {
			name: '预约记录',
		}],
		swiperTabCheckIndex: 0,
		noReservation: false, // 是否有预约
		showReservationList: true, // 展示预约列表
		doneReserList: [],// 已预约列表
		cancelReserList: [], // 取消预约
		MEMBER_TYPE: {
			0: {
				memberType: 0,
				memberTypeName: '安驾',
				finished: ''
			},
			1: {
				memberType: 1,
				memberTypeName: '赛道'
			},
			2: {
				memberType: 2,
				memberTypeName: '考试'
			}
		},
		showCancelAppolintModal: false //取消预约确认弹框
	},
	behaviors: [behavior],
	onLoad() {
		// 获取tabBar高度;
		this.getTabBarHeight(this);
		// this.reservationRecord(this.data.swiperTabCheckIndex);
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1,
			});
		};
		this.reservationRecord(this.data.swiperTabCheckIndex);
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
		this.reservationRecord(this.data.swiperTabCheckIndex);
	},
	/**
	 * swiper 滑动切换
	 * @param {*} e
	 */
	changeSwiperCurrent(e) {
		const { detail: { current: swiperTabCheckIndex } = {} } = e || {};
		this.setData({
			swiperTabCheckIndex,
		});
		this.reservationRecord(this.data.swiperTabCheckIndex);
	},
	/**
	 * 关闭取消预约弹框
	 */
	closeCancelModal: throttle(function (e) {
		this.setData({
			showCancelAppolintModal: false
		})
	}),
	/**
	 * 弹出取消预约弹框
	 */
	showCancelModal: throttle(function (e) {
		const { target: { dataset: { item } = {} } = {} } = e || {};
		this.setData({
			showCancelAppolintModal: true,
			currentCancelItem: item, // 保存当前需要取消的预约列表id
		})
	}),
	/**
	 * 取消预约
	 */
	cancelReservation: throttle(async function (e) {
		try {
			wx.showLoading({
				title:'取消中...'
			})
			const { currentCancelItem: item } = this.data || {};
			const { reservationId } = item || {};
			const { code, msg } = await apis.CANCEL_RESERVATE({ reservationId });
			wx.hideLoading();
			this.closeCancelModal()
			if (code === 200) {
				wx.showToast({
					icon: 'success',
					title: msg
				})
				this.reservationRecord(this.data.swiperTabCheckIndex);
			} else {
				wx.showToast({
					icon: 'error',
					title: msg
				})
			}
		} catch (err) {
			console.log(`err`, err);
		}
	}),
	/**
	 * 支付VIP
	 */
	payVip: throttle(function(){
		wx.navigateTo({
			url: '/pages/payInfo/payInfo',
		});
	}),
});
