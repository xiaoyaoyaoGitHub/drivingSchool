/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-04-13 15:55:36
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-13 21:14:14
 * @FilePath: /wxapp-boilerplate/src/pages/recommendations/recommendations.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { throttle } from '@/utils/lodash-fix';

const app = getApp();
const apis = app.apis;
Page({
	data: {
		textValue: '',
	},
	onLoad() {

	},
	/**
	 * 输入框失去焦点获取
	 * @param {*} e
	 */
	bindTextAreaBlur(e) {
		const { detail: { value: textValue } = {} } = e || {};
		this.setData({
			textValue,
		});
	},
	/**
	 * 提交
	 */
	addRecommend: throttle(async function () {
		try {
			const { code, msg } = await apis.ADD_COMPLAIN({ content: this.data.textValue });
			if (code === 200) {
				wx.showToast({
					icon: 'success',
					title: '提交成功',
					success() {
						wx.navigateBack();
					},
				});

			}
			else {
				wx.showToast({
					icon: 'error',
					title: msg,
				});
			}
		}
		catch (err) {
			console.log(err);
			wx.showToast({
				icon: 'error',
				title: '提交失败',
			});
		}
	}),
});
