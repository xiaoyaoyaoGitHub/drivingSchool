/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 17:07:13
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-22 22:21:33
 * @FilePath: /wxapp-boilerplate/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Ajax from './AjaxUtil';

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
	/**
	 * 请求静默授权的authcode
	 * @returns
	 */
	const getBaseAuthCode = () => {
		return new Promise((resolve, reject) => {
			wx.login({
				success(res) {
					if (res.code) {
						resolve(res.code);
					}
					else {
						my.showToast({
							content: '授权失败，请稍后重试',
						});
						reject(res);
					}
				},
				fail(err) {
					reject(err);
				},
			});
		});
	};

	/**
	 * 请求指定scopes的授权authcode
	 * @param scopes
	 * @returns
	 */
	const getAuthCode = (scopes = 'auth_base') => {
		return new Promise((resolve, reject) => {
			my.getAuthCode({
				scopes: scopes,
				success: (res = {}) => {
					const { authCode } = res;
					if (!authCode || typeof authCode !== 'string') {
						my.showToast({
							content: '授权失败，请稍后重试',
						});
						reject(res);
					}
					else {
						resolve(authCode);
					}
				},
				fail: (err = {}) => {
					console.log(err);

					if (err.error === 11) {

						console.log('用户取消授权');
					}
					else {
						my.showToast({
							content: '授权失败，请稍后重试',
						});
					}
					reject(err);
				},
			});
		});
	};

	const requestInterceptorFunc = (config = {}) => {
		const authCode = config.headers.authCode;

		if (config.baseURL == null || config.baseURL === '') {
			config.baseURL = hostConfig.url;
		}
		config.data.authcode = authCode;

		// 转换formData
		if (config.method === 'POST' && config.dataType === 'formData') {
			config.headers = {
				...config.headers,
				'content-type': 'application/x-www-form-urlencoded',
			};
			delete config.dataType;
		}

		return config;
	};
	const requestInterceptorFuncWrapper = (config = {}) => {
		const gloalData = getApp().globalData;

		const { urlParams, version, token } = gloalData;
		const { userId = '' } = urlParams || {};
		config.data = {
			userId,
			version: version,
			token: token,
			...config.data,
		};

		if (config.data.authcode) {
			// 特殊scopes授权的自己请求authCode传入
			config.headers.authCode = config.data.authcode;
			return requestInterceptorFunc(config);
		}
		else {
			// 大部分接口从缓存读取基本authCode
			return getBaseAuthCode()
				.then((authCode) => {
					config.headers.authCode = authCode;
					return requestInterceptorFunc(config);
				})
				.catch((err) => {
					return Promise.reject(err);
				});
		}
	};
	instance.interceptors.request.use(requestInterceptorFuncWrapper);

	const responseInterceptorFunc = (response = { code: '', msg: '' }, config = {}) => {
		console.log(response);
		return Promise.resolve(response);
	};
	const responseInterceptorFuncWrapper = (response = {}, config) => {
		return responseInterceptorFunc(response, config);
	};
	const responseInterceptorErrFunc = (err, config = {}) => {
		getApp().logError(config, null, err);
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
				methods: 'GET',
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
				methods: 'GET',
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
				methods: 'GET',
				data,
				...options,
			});
		},
	};
};

export default {
	init,
};
