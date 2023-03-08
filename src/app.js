/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-07 17:22:18
 * @FilePath: /wxapp-boilerplate/src/app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { camelCase } from 'lodash';
import * as API from '@/api/index';

App({
	onLaunch() {
		console.log(camelCase('OnLaunch'));
		// 调用API从本地缓存中获取数据
		const logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);
	},
	getUserInfo(cb) {
		if (this.globalData.userInfo) {
			typeof cb === 'function' && cb(this.globalData.userInfo);
		}
		else {
			// 调用登录接口
			wx.login({
				success: () => {
					wx.getUserInfo({
						success: (res) => {
							this.globalData.userInfo = res.userInfo;
							typeof cb === 'function' && cb(this.globalData.userInfo);
						},
					});
				},
			});
		}
	},
	globalData: {
		userInfo: null,
	},
});
