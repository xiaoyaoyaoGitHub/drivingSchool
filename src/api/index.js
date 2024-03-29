/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 17:07:13
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-30 13:03:07
 * @FilePath: /wxapp-boilerplate/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Ajax from './AjaxUtil';
import { global } from '@/store/index';

const hostConfig = {
	// url: 'http://39.98.207.154:9000',
	// url: 'http://www.mojiezuo.store:9000',
	url: 'https://www.mojiezuo.store:443',
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
		if (config.method === 'POST' && config.dataType === 'form') {
			config.header = {
				'content-type': 'application/x-www-form-urlencoded',
				...config.header,
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
		// console.log(config);
		const UN_CHECK_API = ['/mobile/member/getMemberById', '/mobile/reservation/record'];
		if (response.code === 401 && !UN_CHECK_API.includes(config.url)) { // 需要登录
			const routes = getCurrentPages();
			console.log('routes', routes);
			if (routes.pop().route === 'pages/login/login') return;
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
		 * 获取banner图（首页解摩杰座，安驾科目，会员商品，二手好车的banner图从这里获取）
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
				url: '/mobile/anuuncement/selectMotorAnuuncementListAll',
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
				dataType: 'form',
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
				url: '/mobile/complaint',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 设置车牌或者紧急联系人
		 * @param {*} data.memberId 会员ID
		 * @param {*} data.carNumber 车牌列表
		 * @param {*} options
		 * @returns
		 */
		ADD_CAR_NUMBER(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/member',
				method: 'PUT',
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
				url: '/mobile/member',
				method: 'PUT',
				data,
				...options,
			});
		},
		/**
		 * 创建订单
		 * @param {*} data
		 * @param {*} options
		 */
		CREATE_ORDER(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/order/createOrder',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 想要计数
		 * @param {*} data
		 * @param {*} options
		 */
		USER_WANT_INCR(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/module/userWantIncr',
				method: 'GET',
				data,
				...options,
			});
		},
		/**
		 * 安驾会员启停卡
		 * @param {*} data
		 * @param {*} options
		 */
		ACTIVITE_SAFE_DRIVER_CARD(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/member/activateSafeDriverCard',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 安驾会员激活
		 * @param {*} data
		 * @param {*} options
		 */
		START_SAFE_DRIVER_CARD(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/member/startSafeDriverCard',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 赛道会员启停卡
		 * @param {*} data
		 * @param {*} options
		 */
		ACTIVITE_TRACK_CARD(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/member/activateTrackCard',
				method: 'POST',
				data,
				...options,
			});
		},
		/**
		 * 赛道会员激活
		 * @param {*} data
		 * @param {*} options
		 */
		START_TRACK_CARD(data = {}, options = {}) {
			return getInstance.http({
				baseURL: hostConfig.url,
				url: '/mobile/member/startTrackCard',
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
