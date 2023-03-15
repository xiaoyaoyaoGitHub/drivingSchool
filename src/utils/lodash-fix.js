/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-15 15:37:03
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-15 15:44:12
 * @FilePath: /wxapp-boilerplate/src/utils/loaash-fix.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 节流
export const throttle = (fn, timer = 500) => {
	let preTime;
	return function (params) {
		const nowTime = new Date();
		if (!preTime || (nowTime - preTime) > timer) {
			fn.call(this, params);
			preTime = nowTime;
		}
	};
};

// 函数防抖
export const debounce = (func, wait) => {
	let timer;
	return function () {
		const context = this; // 注意 this 指向
		const args = arguments; // arguments中存着e

		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
};

// 判断版本
export const checkVersion = () => {
	try {
		const currentVersion = my.SDKVersion || {}; // 获取当前版本号
		const currVersionArray = currentVersion.split('.'); // 分割成数组
		const BASE_VERSION = ['1', '8', '0']; // 定义基础版本
		for (const index in BASE_VERSION) {
			if (Number(currVersionArray[index]) > Number(BASE_VERSION[index])) {
				return true;
			}
			else if (Number(currVersionArray[index]) === Number(BASE_VERSION[index])) {
				if (index === BASE_VERSION.length - 1) {
					return true;
				}
				continue;
			}
			else {
				return false;
			}
		}
	}
	catch (err) {
		return false;
	}
};

export const qs = {
	parse: (str = '') => {
		const arr = str.split('&');
		const obj = {};
		arr.forEach((item) => {
			const index = item.indexOf('=');
			const key = item.slice(0, index);
			const val = item.slice(index + 1);
			obj[key] = val;
		});
		return obj;
	},
	stringify: (obj = {}) => {
		const arr = [];
		for (const key in obj) {
			arr.push(key + '=' + obj[key]);
		}
		return arr.join('&');
	},
};

// 日期格式化
export const formatDate = (date, fmt = 'YYYY-MM-dd HH:mm:ss') => {
	if (date == null) return null;
	if (typeof date === 'string') {
		date = date.slice(0, 19).replace('T', ' ').replace(/-/g, '/');
		date = new Date(date);
	}
	else if (typeof date === 'number') {
		date = new Date(date);
	}
	const o = {
		'[Yy]+': date.getFullYear(), // 年
		'M+': date.getMonth() + 1, // 月份
		'[Dd]+': date.getDate(), // 日
		'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
		'H+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds(), // 毫秒
	};
	const week = {
		'0': '/u65e5',
		'1': '/u4e00',
		'2': '/u4e8c',
		'3': '/u4e09',
		'4': '/u56db',
		'5': '/u4e94',
		'6': '/u516d',
	};
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + '']);
	}
	for (const k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		}
	}
	return fmt;
};

// 获取月份的天数
export const getMonthDays = (year, month) => {
	var stratDate = new Date(year, month - 1, 1);
	var endData = new Date(year, month, 1);
	var days = (endData - stratDate) / (1000 * 60 * 60 * 24);
	return days;
};

export const compare = (property) => {
	return function (a, b) {
		var value1 = a[property];
		var value2 = b[property];
		return value2 - value1;
	};
};

export const safeJsonParse = (str, defaultVal) => {
	try {
		return JSON.parse(str);
	}
	catch (err) {
		console.log(err);
		return defaultVal;
	}
};

export const checkIpxDevice = (systemInfo) => {
	// 市面上场景留海屏机型models
	const ipxModels = [
		'iPhone X', // 模拟器
		// iphone
		'iPhone10,3',
		'iPhone10,6',
		'iPhone11',
		'iPhone12',
		'iPhone13',
		// 华为
		'HUAWEI ANE-TL00', // nova 3e
		'HUAWEI JER-AN10', // nova 7 pro 5g
		'HUAWEI LYA-AL00', // 20 pro
		'HUAWEI CLT-AL01', // p20 pro
		'HUAWEI LYA-AL00', // mate20 pro
		'HUAWEI TAS-AL00', // mate30
		'HUAWEI LIO-AN00', // mate30 pro 5g
		'HUAWEI STF-AL00', // honor9
		// 小米
		// 三星
		// oppo
		// vivo
		'vivo V1809T', // x23
		// 其他
		'smartisan DE106', // 坚果r1
		'deltainno DT1901A', // 坚果pro3
	];

	if (systemInfo) {
		// ios机型直接判断参数
		if (systemInfo.isIphoneXSeries) return true;

		// 安卓机型判断model
		if (systemInfo.model) {
			const model = systemInfo.model;
			for (const item of ipxModels) {
				if (model.indexOf(item) > -1) return true;
			}
		}
	}

	return false;
};
