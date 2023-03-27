/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 16:45:45
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-03-27 21:19:33
 * @FilePath: /wxapp-boilerplate/src/components/reservation/reservation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { throttle } from '@/utils/lodash-fix';

const app = getApp();
const apis = app.apis;

Component({
	data: {
		// 类型
		showTypePicker: false,
		selectTypeInfo: {}, // 勾选的类型
		preSelectTypeInfo: {}, // 预勾选的类型
		typeList: [], // 类型选择列表

		// 校区
		showLocationPicker: false,
		selectLocationInfo: {}, // 选择的校区
		preSelectLocationInfo: {}, // 预选择的校区
		locationList: [], // 可选校区列表

		// 科目
		subjectsPicker: false,
		selectCourseInfo: {}, // 选择科目
		preSelectCourseInfo: {}, // 预选科目
		courseList: [], // 可选科目

		// 时间段
		timePicker: false,
		selectScheduleInfo: {}, //  选择时间列表
		preSelectScheduleInfo: {}, // 预选择时间列表
		selectTimeList: [],
		preSelectTimeList: [],
		scheduleList: [], // 可选天列表
		timeList: [], // 可选时间列表
		selectDayIndex: 0, // 时间默认选择
		preSelectTimeIdList: [],
	},
	attached() {
		this.getTypeList();
	},
	observers: {
		// 监听类型变化,根据新值获取校区列表和课程列表
		'selectTypeInfo.memberType': function (memberType) {
			this.getLocationList({ memberType });
			this.getCourseList({ memberType, memberId: '' });
		},
		// 监听校区变化,根据新值获取科目列表
		'selectLocationInfo.campusId': function (campusId) {
			const { selectTypeInfo: { memberType } = {}, memberId = '' } = this.data || {};
			this.getTimeIntervalList({ campusId, memberType, memberId });
		},
	},
	methods: {
		/**
		 * 获取类型列表
		 */
		async getTypeList() {
			const { code, data: typeList = [] } = await apis.GET_MEMBER_TYPE_LIST();
			if (code === 200) {
				this.setData({
					typeList,
				});
			}
		},
		/**
		 * 选择类型 弹出picker
		 */
		typePickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			console.log(this.data);
			if (type === 'confirm') { // 确定
				this.setData({
					selectTypeInfo: this.data.preSelectTypeInfo,
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectTypeInfo: this.data.selectTypeInfo,
				});
			}
			this.setData({
				showTypePicker: !this.data.showTypePicker,
			});
		}),
		/**
		 * 勾选类型
		 */
		selectTypeClick: throttle(function (e) {
			const { target: { dataset: { item: preSelectTypeInfo } = {} } = {} } = e || {};
			this.setData({
				preSelectTypeInfo,
			});
		}),
		/**
		 * 获取校区列表
		 * @param {Object} params.memberType 会员类型
		 */
		async getLocationList(params) {
			const { code, data: locationList = [] } = await apis.GET_CAMPUS_LIST(params);
			if (code === 200) {
				this.setData({
					locationList,
				});
			}
		},
		/**
		 * 选择校区 弹出picker
		 */
		locationPickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			if (type === 'confirm') { // 确定
				this.setData({
					selectLocationInfo: this.data.preSelectLocationInfo,
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectLocationInfo: this.data.selectLocationInfo,
				});
			}
			this.setData({
				showLocationPicker: !this.data.showLocationPicker,
			});
		}),
		/**
		 * 选择校区列表点击
		 */
		selectLocationClick: throttle(function (e) {
			const { target: { dataset: { item: preSelectLocationInfo } = {} } = {} } = e || {};
			this.setData({
				preSelectLocationInfo,
			});
		}),

		/**
		 * 获取课程列表
		 * @param {*} params.memberType 会员类型
		 * @param {*} params.memberId 会员id
		 */
		async getCourseList(params) {
			const { code, data: courseList = [] } = await apis.GET_COURSE_LIST(params);
			if (code === 200) {
				this.setData({
					courseList,
				});
			}
		},
		/**
		 * 选择科目
		 */
		selectCourseClick: throttle(function (e) {
			console.log(e);
			const { target: { dataset: { item: preSelectCourseInfo } = {} } = {} } = e || {};
			this.setData({
				preSelectCourseInfo,
			});
		}),

		/**
		 * 选择科目 弹出picker
		 */
		subjectsPickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			console.log(this.data);
			if (type === 'confirm') { // 确定
				this.setData({
					selectCourseInfo: this.data.preSelectCourseInfo,
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectCourseInfo: this.data.selectCourseInfo,
				});
			}
			this.setData({
				subjectsPicker: !this.data.subjectsPicker,
			});
		}),

		/**
		 * 获取时间列表
		 * @param {*} params.campusId 校区ID
		 * @param {*} params.memberId 会员ID
		 * @param {*} params.memberType 会员类型
		 */
		async getTimeIntervalList(params) {
			const { code, data: scheduleList = [] } = await apis.GET_TIME_INTERVAL_LIST(params);
			if (code === 200) {
				this.setData({
					scheduleList,
				});
				if (scheduleList.length > 0) {
					this.setData({
						timeList: scheduleList[0].timeIntervalList,
					});
				}
			}
		},
		/**
		 * 选择时间段
		 */
		schedulePickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			const { selectDayIndex, preSelectTimeList,scheduleList } = this.data || {};
			if (type === 'confirm') { // 确定
				console.log(`preSelectTimeList`,preSelectTimeList);
				this.setData({
					selectScheduleInfo: scheduleList[selectDayIndex],
					selectTimeList: preSelectTimeList
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectCourseInfo: this.data.selectCourseInfo,
				});
			}
			console.log(this.data);

			this.setData({
				timePicker: !this.data.timePicker,
			});
		}),
		/**
		 * 天选择
		 */
		bindDayPickerChange(e) {
			console.log(e);
			const { detail: { value: selectDayIndex = [] } = {} } = e || {};
			this.setData({
				selectDayIndex: selectDayIndex[0],
			}, () => {
				this.setData({
					timeList: this.data.scheduleList[selectDayIndex].timeIntervalList,
				});
			});
		},
		/**
		 * 选择天下面的时间段
		 */
		addTimeList: throttle(function (e) {
			console.log(e);
			const { target: { dataset: { item: curTimeInterval } } = {} } = e || {};
			console.log(`curTimeInterval`, curTimeInterval);
			const curSelectTimeList = this.data.preSelectTimeList.concat();
			// 是否存在当前选中的时间段
			const isExist = curSelectTimeList.filter((item) => item.timeIntervalId === curTimeInterval.timeIntervalId).length > 0;
			console.log(`isExist`, isExist);
			// 不存在则追加
			if (!isExist) {
				curSelectTimeList.push(curTimeInterval);
			}
			else {
				// 否则删除
				const existIndex = curSelectTimeList.findIndex((item) => item.timeIntervalId === curTimeInterval.timeIntervalId);
				console.log(`existIndex`, existIndex);
				curSelectTimeList.splice(existIndex, 1);
			}

			this.setData({
				preSelectTimeList: curSelectTimeList,
			});

			const preSelectTimeIdList = [];
			curSelectTimeList.forEach(item => {
				preSelectTimeIdList.push(item.timeIntervalId)
			})
			this.setData({
				preSelectTimeIdList
			})
			console.log(`preSelectTimeIdList`, preSelectTimeIdList);
			console.log(`curSelectTimeList`, this.data.preSelectTimeList);
		}),
	},
});
