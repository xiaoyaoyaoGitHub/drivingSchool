/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-18 19:37:24
 * @FilePath: /wxapp-boilerplate/src/pages/logs/logs.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { behavior } from './behavior';
import { throttle } from '@/utils/lodash-fix';
import { global } from '@/store/index';

const app = getApp();
const apis = app.apis;

Page({
	data: {
		logs: [],
		info: {},
		carsList: [1, 2, 3], // 车牌号
		addLicenceStatus: false, // 添加车牌号弹框状态
		licenceValue: '', // 输入的车牌号
		emergencyStatus: false, // 添加紧急联系人弹框状态
		emergencyName: '', // 紧急联系人姓名
		emergencyNumber: '', // 紧急联系人手机号
	},
	behaviors: [behavior],
	onLoad() {
		try {
			this.getTabBarHeight();
			this.getUserInfo();
		}
		catch (err) {
			console.log(err);
		}

	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 2,
			});
		}
	},
	/**
	 * 登录
	 */
	login: throttle(function (e) {
		my.navigateTo({
			url: '/pages/login/login',
		});
	}),
	/**
	 * 增加车牌号
	 */
	addLicence: throttle(function () {
		this.setData({
			addLicenceStatus: true,
		});
	}),
	/**
	 * 关闭车牌号
	 */
	closeLicence: throttle(function () {
		this.setData({
			addLicenceStatus: false,
		});
	}),
	/**
	 * 添加车牌号确认按钮
	 */
	addLicenceConfirm: throttle(async function () {
		try {
			const { code, msg } = await apis.ADD_CAR_NUMBER({ carNumber: this.data.licenceValue });
			this.setData({
				addLicenceStatus: false,
			});
			if (code === 200) {
				// todo 更新车牌号
			}
			else {
				my.showToast({
					icon: 'error',
					title: msg,
				});
			}

		}
		catch (err) {
			console.log(err);
			my.showToast({
				icon: 'error',
				title: '添加失败',
			});
		}
	}),
	/**
	 * 获取用户输入的车牌号
	 */
	getLicence(e) {
		console.log(e);
		const { detail: { value: licenceValue } = {} } = e || {};
		this.setData({
			licenceValue,
		});
	},
	/**
	 * 添加紧急联系人
	 */
	addEmergency: throttle(function (e) {
		this.setData({
			emergencyStatus: true,
		});
	}),
	closeEmeregncy: throttle(function (e) {
		this.setData({
			emergencyStatus: false,
		});
	}),
	/**
	 * 获取紧急联系人姓名
	 */
	getEmergencyName(e) {
		const { detail: { value: emergencyName } = {} } = e || {};
		this.setData({
			emergencyName,
		});
	},
	/**
	 * 阻止冒泡
	 */
	stop() {},
	/**
	 * 获取紧急联系人手机号码
	 */
	getEmergencyNumber(e) {
		console.log(e);
		const { detail: { value: emergencyNumber } = {} } = e || {};
		this.setData({
			emergencyNumber,
		});
	},
	/**
	 * 添加紧急联系人 点击确认
	 */
	addEmergencyConfirm: throttle(async function () {
		try {
			const { emergencyName = '', emergencyNumber: emergencyContacter = '' } = this.data || {};
			const {code, msg} = await apis.SET_EMERGENCY_PHONE({ emergencyContacter });
			this.setData({
				emergencyStatus: false,
			});
			if (code === 200) {
				my.showToast({
					icon: 'success',
					title: '添加成功',
				});
			}
			else {
				my.showToast({
					icon: 'error',
					title: msg,
				});
			}
		}
		catch (err) {
			console.log(err);
			my.showToast({
				icon: 'error',
				title: '添加失败',
			});
		}
	}),
	/**
	 * 添加建议
	 */
	goToRecommend: throttle(function () {
		console.log('click');
		wx.navigateTo({
			url: '/pages/recommendations/recommendations',
		});
	}),
	/**
	 * 退出
	 */
	logout: throttle(function () {
		global.userInfo = {};
		wx.removeStorageSync('TOKEN');
		wx.reLaunch({
			url: '/pages/index/index',
		});
	}),
});
