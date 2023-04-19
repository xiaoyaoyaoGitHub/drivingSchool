/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-04-19 21:42:44
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-19 21:43:23
 * @FilePath: /wxapp-boilerplate/src/pages/articalDetail/articalDetail.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
Page({
	data: {
		productDetail: {},
	},
	onLoad(query = {}) {
		console.log(query.info);
		const { info = '{}' } = query || {};
		this.setData({
			productDetail: JSON.parse(info),
		});
	},
});
