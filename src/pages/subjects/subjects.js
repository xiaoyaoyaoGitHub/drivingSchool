
/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-20 14:07:41
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-22 09:43:29
 * @FilePath: /wxapp-boilerplate/src/pages/subjects/subjects.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp(); //  eslint-disable-line no-undef
const apis = app.apis;
import { throttle } from '@/utils/lodash-fix';
import { createStoreBindings } from 'mobx-miniprogram-bindings'

import { global } from '@/store/index';

const MODULE_CODE = {
	SAFE_DRIVING_SUBJECT: 'SAFE_DRIVING_SUBJECT'
}
Page({
	data: {
		modulesInfo: [],
		showOpenPayModal:false
	},
	onLoad() {
		// 手工绑定 
		this.storeBindings = createStoreBindings(this, {
			store:global,
			fields: ['isLogin','isPayVip'],
		})
	},
	onUnload() {
		this.storeBindings.destroyStoreBindings()
	},
	onShow() {
		this.getSubjectList()
	},
	/**
	 * 支付VIP
	 */
	payVip: throttle(function(){
		this.closePayModal();
		wx.navigateTo({
			url: '/pages/payInfo/payInfo',
		});
	}),
	stop(){},
	closePayModal:throttle(function(){
		this.setData({
			showOpenPayModal: false
		})
	}),
	/**
	 * 播放
	 */
	toPlayer: throttle(function (e) {
		const { currentTarget: { dataset: { item = '',idx } = {} } = {} } = e || {};
		// 非付费会员超过3个视频不让看
		if(idx > 2 && !this.data.isPayVip){
			this.setData({
				showOpenPayModal: true
			})
			return
		}
		wx.navigateTo({
			url: `/pages/player/player?playerUrl=${item.fistVideoPath}`
		})
	}),
	goToLogin: throttle(function(){
		wx.navigateTo({
			url: `/pages/login/login`
		})
	}),
	/**
   * 获取安架科目
   */
	async getSubjectList() {
		const { SAFE_DRIVING_SUBJECT } = MODULE_CODE || {};
		const { code, data: modulesInfo = {}, msg } = await apis.GET_MODULE_CONTENT({ moduleCode: `${SAFE_DRIVING_SUBJECT}`, pageNum: 1, pageSize: 1000 });
		if (code === 200) {
			this.setData({
				modulesInfo,
			})
		}else {
			wx.showToast({
				title:msg
			})
		}
	},
});
