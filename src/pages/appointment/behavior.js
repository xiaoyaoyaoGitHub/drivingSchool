/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 15:43:02
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-14 15:49:54
 * @FilePath: /wxapp-boilerplate/src/pages/appointment/behavior.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BehaviorWithStore } from 'mobx-miniprogram-bindings';

import { global } from '@/store/index';

export const behavior = BehaviorWithStore({
	storeBindings: [{
		store: global,
		fields: ['tabBarHeight'],
		actions: ['getTabBarHeight'],
	}],
});
