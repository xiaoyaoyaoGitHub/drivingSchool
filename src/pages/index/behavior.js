/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 14:48:46
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-11 16:42:50
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
		actions: ['getTabBarHeight', 'updateTabbarHeight'],
	}, {
		store: global,
		fields: ['isPayVip'],
	}],
});
