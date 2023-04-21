/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-15 20:27:39
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-04-21 13:49:27
 * @FilePath: /wxapp-boilerplate/src/pages/my/behavior.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { BehaviorWithStore } from 'mobx-miniprogram-bindings';

import { global } from '@/store/index';

export const behavior = BehaviorWithStore({
	storeBindings: [
		{
			store: global,
			fields: ['tabBarHeight', 'transparentHeight', 'statusBarHeight', 'totalHeight', 'userInfo', 'titleHeight'],
			actions: ['getTabBarHeight', 'getUserInfo'],
		}, {
			store: global,
			fields: {
				'cardList': (store) => {
					const { userInfo: {carNumber1, carNumber2, carNumber3} = {} } = store || {};
					const tempCardList = [];
					if (carNumber1) {
						tempCardList.push(carNumber1);
					}
					if (carNumber2) {
						tempCardList.push(carNumber2);
					}
					if (carNumber3) {
						tempCardList.push(carNumber3);
					}
					tempCardList.length = 3;
					return tempCardList;
				},
			},
		},
	],
});
