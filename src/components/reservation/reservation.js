/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-14 16:45:45
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-05-05 11:21:58
 * @FilePath: /wxapp-boilerplate/src/components/reservation/reservation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { throttle } from '@/utils/lodash-fix';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { reservationStore } from "@/store/index"

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
		this.storeBindings = createStoreBindings(this, {
			store: reservationStore,
			actions: ['hideAddReservation']
		})
	},
	observers: {
		// 监听类型变化,根据新值获取校区列表和课程列表
		'selectTypeInfo.memberType': function (memberType) {
			// this.getLocationList({ memberType });
			// this.getCourseList({ memberType, memberId: '' });
		},
		// 监听校区变化,根据新值获取时间列表
		'selectLocationInfo.campusId': function (campusId) {
			// const { selectTypeInfo: { memberType } = {}, memberId = '' } = this.data || {};
			// this.getTimeIntervalList({ campusId, memberType, memberId });
		},
	},
	methods: {
		/**
		 * 获取类型列表
		 */
		async getTypeList() {
			wx.showLoading({
				title: '获取类型列表中...'
			})
			const { code, data: typeList = [] } = await apis.GET_MEMBER_TYPE_LIST();
			wx.hideLoading()
			if (code === 200) {
				this.setData({
					showTypePicker: !this.data.showTypePicker,
				});
				this.setData({
					typeList,
				});
			} else {
				wx.showToast({
					icon: 'none',
					title: '获取类型列表失败'
				})
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

					selectLocationInfo: {},
					preSelectLocationInfo:{},

					selectCourseInfo: {},
					preSelectCourseInfo:{},

					selectScheduleInfo: {},
					preSelectScheduleInfo:{},

					selectTimeList: [],
					preSelectTimeList:[],
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectTypeInfo: this.data.selectTypeInfo,
				});
			};
			if (!this.data.showTypePicker) {
				this.getTypeList();
				return
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
		async getLocationList(params = {}) {
			try {
				params.memberType = this.data.selectTypeInfo.memberType;
				console.log(`params.memberType`, params);
				if (params.memberType === undefined) {
					wx.showToast({
						icon: 'none',
						title: '请选择类型'
					})
					return
				}
				wx.showLoading({
					title: '获取校区列表中...'
				})
				const { code, data: locationList = [] } = await apis.GET_CAMPUS_LIST(params);
				wx.hideLoading()
				if (code === 200) {
					this.setData({
						showLocationPicker: !this.data.showLocationPicker,
					});
					this.setData({
						locationList,
					});
				} else {
					wx.showToast({
						icon: 'none',
						title: '获取校区列表失败'
					})
				}
			} catch (err) {
				console.log(err);
				wx.showToast({
					icon: 'none',
					title: '获取校区列表失败'
				})
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
					selectCourseInfo: {},
					preSelectCourseInfo:{},

					selectScheduleInfo: {},
					preSelectScheduleInfo:{},

					selectTimeList: [],
					preSelectTimeList:[],
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectLocationInfo: this.data.selectLocationInfo,
				});
			};
			if (!this.data.showLocationPicker) {
				this.getLocationList();
				return
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
		async getCourseList(params = {}) {
			params.memberType = this.data.selectTypeInfo.memberType;
			params.campusId = this.data.selectLocationInfo.campusId;
			if (params.memberType === undefined) {
				wx.showToast({
					icon: 'none',
					title: '请选择类型'
				})
				return
			}
			if (params.campusId == undefined) {
				wx.showToast({
					icon: 'none',
					title: '请选择校区'
				})
				return
			}
			wx.showLoading({
				title: '获取课程列表中...'
			})
			const { code, data: courseList = [] } = await apis.GET_COURSE_LIST(params);
			wx.hideLoading();
			if (code === 200) {
				this.setData({
					courseList,
				});
				this.setData({
					subjectsPicker: !this.data.subjectsPicker,
				});
			} else {
				wx.showToast({
					icon: 'none',
					title: '获取课程列表失败'
				})
			}
		},
		/**
		 * 选择科目 弹出picker
		 */
		subjectsPickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			console.log(this.data);
			if (type === 'confirm') { // 确定
				this.setData({
					selectCourseInfo: this.data.preSelectCourseInfo,
					selectScheduleInfo: {},
					preSelectScheduleInfo:{},
					selectTimeList: [],
					preSelectTimeList:[]
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectCourseInfo: this.data.selectCourseInfo,
				});
			}
			if (!this.data.subjectsPicker) {
				this.getCourseList();
				return
			}
			this.setData({
				subjectsPicker: !this.data.subjectsPicker,
			});
		}),
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
		 * 获取时间列表
		 * @param {*} params.campusId 校区ID
		 * @param {*} params.memberId 会员ID
		 * @param {*} params.memberType 会员类型
		 */
		async getTimeIntervalList(params = {}) {
			const { selectTypeInfo: { memberType } = {}, memberId = '', selectLocationInfo: { campusId } = {}, selectCourseInfo: { courseId } = {} } = this.data || {};
			if (memberType === undefined) {
				wx.showToast({
					icon: 'none',
					title: '请选择类型'
				})
				return
			}
			if (campusId == undefined) {
				wx.showToast({
					icon: 'none',
					title: '请选择校区'
				})
				return
			}
			if (courseId === undefined) {
				wx.showToast({
					icon: 'none',
					title: '请选择课程'
				})
				return
			}
			wx.showLoading({
				title: '获取时间列表中...'
			})
			const { code, data: scheduleList = [] } = await apis.GET_TIME_INTERVAL_LIST({ memberType, memberId, campusId, courseId });
			wx.hideLoading()
			if (code === 200) {
				this.setData({
					scheduleList,
				});
				if (scheduleList.length > 0) {
					this.setData({
						timeList: scheduleList[0].timeIntervalList,
						preSelectTimeIdList: []
					});
					this.setData({
						timePicker: !this.data.timePicker,
					});
				}
			} else {
				wx.showToast({
					icon: 'none',
					title: '获取列表失败'
				})
			}
		},
		/**
		 * 选择时间段
		 */
		schedulePickerSwitch: throttle(function (e) {
			const { target: { dataset: { type = '' } } = {} } = e || {};
			const { selectDayIndex, preSelectTimeList, scheduleList } = this.data || {};
			if (type === 'confirm') { // 确定
				console.log(`preSelectTimeList`, preSelectTimeList);
				this.setData({
					selectScheduleInfo: scheduleList[selectDayIndex],
					selectTimeList: preSelectTimeList,
					preSelectTimeList: []
				});
			}
			if (type === 'cancel') { // 取消
				this.setData({
					preSelectCourseInfo: this.data.selectCourseInfo,
				});
			}
			console.log(this.data);
			if (!this.data.timePicker) {
				this.getTimeIntervalList();
				return
			}
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
					preSelectTimeIdList: [],
					preSelectTimeList:[]
				});
				console.log(this.data);
			});
		},
		/**
		 * 选择天下面的时间段
		 */
		addTimeList: throttle(function (e) {
			console.log(e);
			const { target: { dataset: { item: curTimeInterval, index } } = {} } = e || {};
			console.log(`curTimeInterval`, curTimeInterval, index);
			const curSelectTimeList = this.data.preSelectTimeList.concat();
			// 是否存在当前选中的时间段
			const isExist = curSelectTimeList.filter((item) => item.timeIntervalId === curTimeInterval.timeIntervalId).length > 0;
			console.log(`isExist`, isExist);
			const tempTimeList = `timeList[${index}].selected`
			// 不存在则追加
			if (!isExist) {
				curSelectTimeList.push(curTimeInterval);
				this.setData({
					[tempTimeList]: true
				})
			}
			else {
				// 否则删除
				const existIndex = curSelectTimeList.findIndex((item) => item.timeIntervalId === curTimeInterval.timeIntervalId);
				console.log(`existIndex`, existIndex);
				curSelectTimeList.splice(existIndex, 1);
				this.setData({
					[tempTimeList]: false
				})
			}
			console.log(this.data.timeList);
			this.setData({
				preSelectTimeList: curSelectTimeList,
			});

			const preSelectTimeIdList = [];
			curSelectTimeList.forEach(item => {
				preSelectTimeIdList.push(item.timeIntervalId);

			})
			this.setData({
				preSelectTimeIdList
			})
			console.log(`preSelectTimeIdList`, preSelectTimeIdList);
			console.log(`curSelectTimeList`, this.data.preSelectTimeList);
		}),
		/**
		 * 提交预约
		 */
		reservation: throttle(async function (e) {
			try {
				const { selectTypeInfo, selectCourseInfo, selectLocationInfo, selectScheduleInfo, selectTimeList: timeIntervalList = [] } = this.data || {};
				const { memberType } = selectTypeInfo || {}; // 会员类型ID	
				const { campusId } = selectLocationInfo || {}; // 校区ID	
				const { courseId } = selectCourseInfo || {}; // 课程ID	
				const { scheduleId, scheduleDate } = selectScheduleInfo || {}; // 课程日期id	 上课日期
				if (memberType === undefined) {
					wx.showToast({
						icon: 'none',
						title: '请选择类型'
					})
					return
				}
				if (campusId == undefined) {
					wx.showToast({
						icon: 'none',
						title: '请选择校区'
					})
					return
				}
				if (courseId === undefined) {
					wx.showToast({
						icon: 'none',
						title: '请选择课程'
					})
					return
				}
				if (!timeIntervalList.length) {
					wx.showToast({
						icon: 'none',
						title: "请选择预约时间"
					})
					return
				}
				const { code, msg } = await apis.RESERVATION_RESERVATE({ memberType, campusId, courseId, scheduleId, scheduleDate, timeIntervalList })
				if (code === 200) { // 预约成功
					wx.showToast({
						icon: 'success',
						title: '预约成功'
					});
					this.hideAddReservation()
				} else {
					// 预约失败
					wx.showToast({
						icon: 'error',
						title: msg
					})
				}
			} catch (err) {
				console.log(`err`, err);
				wx.showToast({
					icon: 'error',
					title: '预约失败'
				})
			}
		}),
		/**
		 * 取消
		 */
		cancelReservation: throttle(function(){
			this.hideAddReservation()
		})
	},
});
