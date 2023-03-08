/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-08 22:10:04
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-08 22:13:15
 * @FilePath: /wxapp-boilerplate/src/pages/appointment/appointment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

Page({
	data: {
	},
	onLoad() {

	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1,
			});
		}
	},
});
