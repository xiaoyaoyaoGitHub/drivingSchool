/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-15 20:27:39
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-11 16:52:46
 * @FilePath: /wxapp-boilerplate/src/pages/my/behavior.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { BehaviorWithStore } from 'mobx-miniprogram-bindings';

import { global } from '@/store/index';

export const behavior = BehaviorWithStore({
	storeBindings: [
		{
			store: global,
			fields: ['tabBarHeight', 'transparentHeight', 'statusBarHeight', 'totalHeight', 'userInfo', 'titleHeight', 'isLogin', 'isPayVip'],
			actions: ['getTabBarHeight', 'getUserInfo', 'catchDubbed'],
		}, {
			store: global,
			fields: {
				'cardList': (store) => {
					const { userInfo: { carNumber1, carNumber2, carNumber3 } = {} } = store || {};
					const tempCardList = [];
					if (carNumber1) {
						tempCardList.push({ 0: carNumber1.slice(0, 1), 1: carNumber1.slice(1, 2), 2: carNumber1.slice(2) });
					}
					else {
						tempCardList.push('');
					}
					if (carNumber2) {
						tempCardList.push({ 0: carNumber2.slice(0, 1), 1: carNumber2.slice(1, 2), 2: carNumber2.slice(2) });
					}
					else {
						tempCardList.push('');
					}
					if (carNumber3) {
						tempCardList.push({ 0: carNumber3.slice(0, 1), 1: carNumber3.slice(1, 2), 2: carNumber3.slice(2) });
					}
					else {
						tempCardList.push('');
					}

					return tempCardList;
				},
			},
		},
	],
});
