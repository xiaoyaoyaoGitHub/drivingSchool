/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 17:07:13
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-11 16:27:49
 * @FilePath: /wxapp-boilerplate/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Ajax from './AjaxUtil';
import { global } from '@/store/index';

const hostConfig = {
	url: 'http://39.98.207.154:9000',
};

/**
 * 初始化所有apis
 * @returns
 */
const init = () => {
	const instance = Ajax.create({
		baseURL: '',
		timeout: 30000,
	});

	const requestInterceptorFunc = (config = {}) => {

		if (config.baseURL == null || config.baseURL === '') {
			config.baseURL = hostConfig.url;
		}
		// 转换formData
		if (config.method === 'POST' && config.dataType === 'formData') {
			config.header = {
				...config.header,
				'content-type': 'application/x-www-form-urlencoded',
			};
			delete config.dataType;
		}

		return config;
	};
	const requestInterceptorFuncWrapper = (config = {}) => {
		console.log('global', global);
		const { userInfo = {} } = global || {};

		const { token: Authorization, memberId } = userInfo;
		config.header = { ...config.header, Authorization };
		config.data = {
			memberId,
			...config.data,
		};
		return requestInterceptorFunc(config);
	};
	instance.interceptors.request.use(requestInterceptorFuncWrapper);

	const responseInterceptorFunc = (response = { code: '', msg: '' }, config = {}) => {
		if (response.code === 401) { // 需要登录
			wx.navigateTo({
				url: '/pages/login/login',
			});
		}
		return Promise.resolve(response);
	};
	const responseInterceptorFuncWrapper = (response = {}, config) => {
		return responseInterceptorFunc(response, config);
	};
	const responseInterceptorErrFunc = (err, config = {}) => {
		// getApp().logError(config, null, err);
		return Promise.reject(err);
	};
	instance.interceptors.response.use(
		responseInterceptorFuncWrapper,
		responseInterceptorErrFunc,
	);

	const getInstance = {
		get(options = {}) {
			options.method = 'GET';
			return getInstance.http(options);
		},
		post(options = {}) {
			options.method = 'POST';
			return getInstance.http(options);
		},
		http(options = {}) {
			return instance.http(options);
		},
	};

	return {
		/**
		 * 获取会员类型列表
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		GET_MEMBER_TYPE_LIST(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/getMemberTypeList',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取校区列表
		 * @param {*} data
		 * @param {*} options
		 */
		GET_CAMPUS_LIST(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/getCampusList',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取课程列表
		 * @param {*} data
		 * @param {*} options
		 */
		GET_COURSE_LIST(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/getCourseList',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取时段列表
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		GET_TIME_INTERVAL_LIST(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/getTimeIntervalList',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取学校总体日程表
		 * @param {*} data
		 * @param {*} options
		 */
		COURSE_RESERVATION_DETAIL(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/courseReservationDetail',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取banner图（首页解摩羯座，安驾科目，会员商品，二手好车的banner图从这里获取）
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		GET_MODULE_BANNER(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/module/getModuleBanner',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取模块内容（获取模块里的图片，文字，商品等信息）
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		GET_MODULE_CONTENT(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/module/getModuleContent',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取公告
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		GET_ANOUNCEMENTS_LIST(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/getAnouncementsList',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取公告
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		RESERVATION_RECORD(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/record',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 获取验证码
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		VERIFY_CODE(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/motorMessageVerify/verifyCode',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 登录注册
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		MEMBER_LOGIN(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/memberLogin',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 预约(json格式请求)
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		RESERVATION_RESERVATE(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/reservate',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 预约(json格式请求)
		 * @param {*} data
		 * @param {*} options
		 * @returns
		 */
		CANCEL_RESERVATE(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/reservation/cancelReservate',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 获取单个会员详情
		 * @param {*} data
		 * @param {*} options
		 */
		GET_MEMBER_DETAIL(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				// url: `/mobile/member/${data.memberId}`,
				url: '/mobile/member/getMemberById',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 新增投诉
		 * @param {*} data.memberId 会员ID
		 * @param {*} data.description 内容
		 * @param {*} data.createDate 日期
		 * @param {*} options
		 * @returns
		 */
		ADD_COMPLAIN(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/addComplain',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 新增车牌
		 * @param {*} data.memberId 会员ID
		 * @param {*} data.carNumber 车牌列表
		 * @param {*} options
		 * @returns
		 */
		ADD_CAR_NUMBER(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/addCarNumber',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 设置紧急联系人
		 * @param {*} data.memberId 会员ID
		 * @param {*} data.phoneNumber 手机号码
		 * @param {*} options
		 * @returns
		 */
		SET_EMERGENCY_PHONE(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/setEmergencyPhone',
				method: 'POST',
				data,
				...options,
			});
		},
	};
};

export default {
	init,
};
