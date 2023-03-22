

/**
 * ajax拦截器工具类
 */
class Interceptor {
	constructor(option) {
		this.use = (cb = null, errCb = null) => {
			option.cb = cb;
			option.errCb = errCb;
		};
		this.eject = null;
	}
}

/**
 * ajax工具类
 */
class AjaxUtil {

	constructor(option = {}) {
		// 入参
		this.baseURL = option.baseURL || '';
		this.timeout = option.timeout || 30000;
		this.requestConfig = {};
		this.responseConfig = {};

		this.interceptors = {
			request: new Interceptor(this.requestConfig),
			response: new Interceptor(this.responseConfig),
		};
	}

	static create(option) {
		return new AjaxUtil(option);
	}
}

/**
 * 收到请求，放到队列
 */
AjaxUtil.prototype.http = function (options = {}) {
	if (options.data == null) {
		options.data = {};
	}
	if (options.headers == null) {
		options.headers = {};
	}
	/* eslint no-undef: "off"*/
	const page = getCurrentPages().pop();
	if (page) {
		options.headers.rawPage = page.route;
	}
	console.log('options', options);
	return new Promise((resolve, reject) => {
		this.request(options).then(resolve).catch(reject);
	});

};


const wxRequestPromise = function (options) {
	return new Promise((resolve, reject) => {
		wx.request({
			...options,
			success: resolve,
			fail: reject,
		});
	});
};

/**
 * 封装请求
 */
AjaxUtil.prototype.request = async function (options) {
	options = {
		method: 'GET',
		data: {},
		headers: {},
		baseURL: this.baseURL,
		timeout: this.timeout,
		...options,
	};
	if (wx && wx.request) {
		const {
			url,
			baseURL,
			...params
		} = options;
		try {
			const res = await wxRequestPromise({
				url: baseURL + url,
				...params,
			});
			let data = res.data;
			console.log('data', data);

			return data;
		}
		catch (err) {
			if (this.responseConfig.errCb) {
				return this.responseConfig.errCb(err, options);
			}
			else {
				return Promise.reject(err);
			}
		}
	}
};

AjaxUtil.prototype.get = function (options) {
	options.method = 'GET';
	return this.http(options);
};

AjaxUtil.prototype.post = function (options) {
	options.method = 'POST';
	return this.http(options);
};

export default AjaxUtil;
