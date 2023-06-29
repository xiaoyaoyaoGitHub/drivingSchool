/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:48:46
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-06-29 20:44:56
 * @FilePath: /wxapp-boilerplate/src/pages/index/behavior.js
 * @Description: 首页behavior
 */
import { BehaviorWithStore } from 'mobx-miniprogram-bindings';

import { global } from '@/store/index';

export const indexBehavior = BehaviorWithStore({
	storeBindings: [{
		store: global,
		fields: {
			tabBarHeight: (store) => store.tabBarHeight,
			totalHeight: (store) => store.totalHeight,
		},
		actions: ['getTabBarHeight', 'updateTabbarHeight', 'getUserInfo'],
	}, {
		store: global,
		fields: ['isPayVip'],
	}],
});
