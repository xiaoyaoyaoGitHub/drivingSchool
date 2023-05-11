
/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-04-25 14:27:58
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-11 16:51:46
 * @FilePath: /wxapp-boilerplate/src/pages/payInfo/payInfo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { throttle } from '@/utils/lodash-fix';
import { global } from '@/store/index';

const app = getApp();
const apis = app.apis;
Page({
	data: {},
	onLoad() { },
	createOrder: throttle(async function (e) {
		wx.showLoading({
			title: '创建订单中...',
		});
		const loginInfo = await this.login();
		console.log(`loginInfo`, loginInfo);
		// const { encryptedData, iv } = userInfoProfile || {};
		const { userInfo: { phoneNumber } = {} } = global || {};
		console.log('创建订单');
		const result = await apis.CREATE_ORDER({ code: loginInfo.code });
		const { code, data: payInfo = {}, msg } = result || {};
		if (code === 200) {
			wx.requestPayment({
				timeStamp: payInfo.timeStamp,
				nonceStr: payInfo.nonceStr,
				package: payInfo.package,
				signType: 'MD5',
				paySign: payInfo.paySign,
				success(res) {
					wx.hideLoading();
					// 支付成功后刷新用户信息
					global.getUserInfo();
					wx.showToast({
						icon: 'success',
						title: '支付成功',
						duration: 2000,
						success() {

						},
					});
					setTimeout(() => {
						wx.navigateBack();
					}, 2000)
				},
				fail(res) {
					console.log(res);
					wx.hideLoading();
					wx.showToast({
						icon: 'error',
						title: res.errMsg,
					});
				},
			});
		}
		else {
			wx.hideLoading();
			wx.showToast({
				icon: 'error',
				title: msg,
			});
		}

	}),
	getUserInfoProfile() {
		return new Promise((resolve, reject) => {
			return wx.getUserProfile({
				desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: resolve,
				fail: reject,
			});
		});
	},
	login() {
		return new Promise((resolve, reject) => {
			return wx.login({
				success: resolve,
				fail: reject,
			});
		});
	},
});
