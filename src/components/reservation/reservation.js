/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 16:45:45
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-15 16:04:01
 * @FilePath: /wxapp-boilerplate/src/components/reservation/reservation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { throttle } from '@/utils/lodash-fix';

Component({
	data: {
		// 类型
		showTypePicker: false,
		typeValue: '', // 类型名称
		// 校区
		showLocationPicker: false,
		locationValue: '', // 校区位置
		// 科目
		subjectsPicker: false,
		subjectsValue: '', // 科目
	},
	attached() {
	},
	methods: {
		/**
         * 选择类型 弹出picker
         */
		typePickerSwitch: throttle(function () {
			this.setData({
				showTypePicker: !this.data.showTypePicker,
			});
		}),
		/**
         * 选择校区 弹出picker
         */
		locationPickerSwitch: throttle(function () {
			this.setData({
				showLocationPicker: !this.data.showLocationPicker,
			});
		}),
		/**
         * 选择科目 弹出picker
         */
		subjectsPickerSwitch: throttle(function () {
			this.setData({
				subjectsPicker: !this.data.subjectsPicker,
			});
		}),
	},
});
