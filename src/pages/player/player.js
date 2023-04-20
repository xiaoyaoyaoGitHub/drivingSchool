/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-04-09 13:04:40
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-20 18:47:49
 * @FilePath: /wxapp-boilerplate/src/pages/player/player.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
Page({
	data: {
		playerUrl: '',
	},
	onLoad(query) {
		const { playerUrl } = query || {};
		console.log(`playerUrl`,playerUrl);
		const firstGroup = playerUrl.split('.html');
		const items = firstGroup[0].split('/');
		const vid = items[items.length - 1];
		this.setData({ playerUrl: vid });
	},
});
