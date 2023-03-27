/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-18 13:56:48
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-27 15:55:03
 * @FilePath: /wxapp-boilerplate/src/pages/login/login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { behavior } from './behavior';
import { throttle } from '@/utils/lodash-fix';
// 手机号正则校验
const PHONEREG = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
const app = getApp();
const apis = app.apis;

Page({
	data: {
		showLogo: true, // 默认展示logo
		tipsShow: true, // 协议勾选提示黑框
		checkAgreementStatus: false, // 协议勾选状态,默认不勾选
		phoneInput: '', // 输入的手机号
		verifyCode: '', // 验证码
	},
	behaviors: [behavior],
	onLoad() { },
	/**
	 * 关闭协议勾选提示黑框
	 */
	closeTips: throttle(function () {
		this.setData({
			tipsShow: false,
		});
	}),
	/**
	 * 勾选协议
	 */
	checkAgreement: throttle(function () {
		this.setData({
			checkAgreementStatus: !this.data.checkAgreementStatus,
			tipsShow: !!this.data.checkAgreementStatus,
		});
	}),
	/**
	 * 展示登录入口
	 */
	showLogin: throttle(function () {
		if (!this.data.checkAgreementStatus) return;
		this.setData({
			showLogo: false,
		});
	}),
	/**
	 * 输入的手机号
	 * @param {*} e
	 */
	bindPhoneInput(e) {
		const { detail: { value: phoneInput } = {} } = e || {};
		this.phoneInputVerfify = false;
		this.setData({
			phoneInput,
		});
	},
	/**
	 * 校验手机号码
	 */
	verifyPhone() {
		const { phoneInput } = this.data || {};
		if (phoneInput.length === 0) return;
		if (phoneInput.length < 11) {
			wx.showToast({
				title: '请输入11位手机号',
				icon: 'none',
			});

		}
		if (!PHONEREG.test(phoneInput)) {
			wx.showToast({
				title: '请输入正确的手机号码',
				icon: 'none',
			});
			return;
		}
		console.log(`手机号校验通过`);
		this.phoneInputVerfify = true;
	},
	/**
	 * 清空输入的手机号
	 */
	clearPhoneInput: throttle(function () {
		this.phoneInputVerfify = false;
		this.setData({
			phoneInput: '',
		});
	}),
	/**
	 * 点击获取验证码
	 */
	getVerifyCode: throttle(async function () {
		try {
			// 手机号格式不正确,不允许发送验证码
			if (!this.phoneInputVerfify) return;
			console.log('获取验证码');
			const { code } = await apis.VERIFY_CODE({ phoneNumber: this.data.phoneInput });
			if (code === 200) {
				my.showToast({
					title: '获取验证码成功',
					icon: 'none'
				})
			} else {
				my.showToast({
					title: '获取验证码失败',
					icon: 'error'
				})
			}
		} catch (err) {
			console.log(err);
			my.showToast({
				title: '获取验证码失败',
				icon: 'error'
			})
		}
	}),
	/**
	 * 失去焦点获取用户输入的验证码
	 */
	verifyCodeInput(e) {
		const { detail: { value: verifyCode } = {} } = e || {};
		this.setData({
			verifyCode
		})
	},
	/**
	 * 点击登录
	 */
	login: throttle(async function () {
		try {
			const { phoneInput: phoneNumber, verifyCode } = this.data || {};
			if (verifyCode.length === 0) {
				my.showToast({
					title: "请输入验证码",
					icon: 'none'
				})
				return
			}
			if (!this.phoneInputVerfify) {
				my.showToast({
					title: "请输入正确的手机号码",
					icon: 'none'
				})
				return
			}
			const { code, token } = await apis.MEMBER_LOGIN({ verifyCode, phoneNumber });
			if (code === 200) {
				this.refreshToken(token)
				my.showToast({
					title: "登录成功",
					icon: 'success'
				});
				wx.reLaunch({
					url:"/pages/index/index"
				})
			}else{
				my.showToast({
					title: "登录失败,请重试",
					icon: 'error'
				})
			}
		} catch (err) {
			console.log(`err`,err);
			my.showToast({
				title: "登录失败,请重试",
				icon: 'error'
			})
		}
	})
});
