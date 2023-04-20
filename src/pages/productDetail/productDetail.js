/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-20 15:51:11
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-20 18:41:00
 * @FilePath: /wxapp-boilerplate/src/pages/productDetail/productDetail.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
Page({
	data: {
		productDetail: {},
	},
	onLoad(query = {}) {
		console.log(query.info);
		const { info = '{}' } = query || {};
		const infoObj = JSON.parse(info) || {};
		infoObj.itemList.forEach((element) => {
			// 视频类型
			if (element.itemType === 2) {
				const firstGroup = element.videoPath.split('.html');
				const items = firstGroup[0].split('/');
				element.vid = items[items.length - 1];
			}
		});
		this.setData({
			productDetail: infoObj,
		});
	},
});
