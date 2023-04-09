/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-08 22:10:04
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-28 21:07:38
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
		doneReserList:[],// 已预约列表
		cancelReserList:[], // 取消预约
	},
	behaviors: [behavior],
	onLoad() {
		// 获取tabBar高度;
		this.getTabBarHeight(this);
		this.reservationRecord();
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1,
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
		this.reservationRecord();
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
		this.reservationRecord();
	},
	/**
	 * 获取预约记录									
	 */
	async reservationRecord(){
		try {
			const {swiperTabCheckIndex} = this.data || {};
			const isReserving = swiperTabCheckIndex === 0;
			const {code, data:lists = []} = await apis.RESERVATION_RECORD({isReserving});
			if(code === 200){
				if(isReserving){
					this.setData({
						doneReserList:lists
					})
				}else{
					this.setData({
						cancelReserList:lists
					})
				}
				
			}
		}catch(err){
			console.log(`查询预约记录err:`,err);
		}

	},
	/**
	 * 取消预约
	 */
	cancelReservation:throttle(async function(e){
		try {
			const { target:{dataset:{item} = {}} = {} } = e || {};
			const { reservationId } = item || {};
			const res = await apis.CANCEL_RESERVATE({reservationId})
		}catch(err){
			console.log(`err`,err);
		}
	})
});
