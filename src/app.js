/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-07 16:21:28
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-23 13:31:31
 * @FilePath: /wxapp-boilerplate/src/app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { camelCase } from 'lodash';
import { global } from "@/store/index"
import API from "@/api/index"

App({
	globalData: {
		userInfo: null,
		totalHeight: 0,
		
	},
	apis: API.init(),
	onLaunch() {
		console.log('0.9.17 会员卡状态');
		// 获取系统高度
		global.getTitleBarAndStatusBarHeight();
		global.refreshToken();
	},
	onShow() {
		console.log(`camelCase`, camelCase);
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
	onError(err){
		console.log(err);
	},
	onUnhandledRejection(err){
		console.log(err);
	}
});
