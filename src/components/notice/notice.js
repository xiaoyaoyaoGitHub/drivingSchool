/*
 * @Author: wangluyao wangluyao959277@163.com
 * @Date: 2023-03-23 15:09:36
 * @LastEditors: wangluyao wangluyao959277@163.com
 * @LastEditTime: 2023-06-30 15:22:17
 * @FilePath: /wxapp-boilerplate/src/components/notice/notice.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
Component({
	mixins: [],
	properties: {
		anouncementList: {
			type: Array,
			value: [],
		},
	},
	// js
	data: {
		animation: null,
		timer: null,
		duration: 0,
		textWidth: 0,
		wrapWidth: 0,
	},
	attached() {
		this.initAnimation();
	},
	detached() {
		this.destroyTimer();
		this.setData({
			timer: null,
		});
	},
	methods: {
		destroyTimer() {
			if (this.data.timer) {
				clearTimeout(this.data.timer);
			}
		},
		/**
		 * 开启公告字幕滚动动画
		 * @param  {String} text 公告内容
		 * @return {[type]}
		 */
		initAnimation(text) {
			let that = this;
			this.data.duration = 15000;
			this.data.animation = wx.createAnimation({
				duration: this.data.duration,
				timingFunction: 'linear',
			});
			let query = wx.createSelectorQuery().in(this);
			query.select('.content-box').boundingClientRect();
			query.select('#text').boundingClientRect();
			query.exec((rect) => {
				console.log(`rect`, rect);
				that.setData({
					wrapWidth: rect[0].width,
					textWidth: rect[1].width,
				}, () => {
					console.log(`this.data`, this.data);
					// if(this.data.wrapWidth >= this.data.textWidth) return
					this.startAnimation();
				});
			});
		},
		// 定时器动画
		startAnimation() {
			// reset
			// this.data.animation.option.transition.duration = 0
			const resetAnimation = this.data.animation.translateX(this.data.wrapWidth).step({ duration: 0 });
			this.setData({
				animationData: resetAnimation.export(),
			});
			// this.data.animation.option.transition.duration = this.data.duration
			const animationData = this.data.animation.translateX(-this.data.textWidth).step({ duration: this.data.duration });
			setTimeout(() => {
				this.setData({
					animationData: animationData.export(),
				});
			}, 100);
			const timer = setTimeout(() => {
				this.startAnimation();
			}, this.data.duration);
			this.setData({
				timer,
			});
		},
		showContent(e) {
			console.log(e);
			const { target: { dataset: { index = 0 } = {} } = {} } = e || {}
			this.triggerEvent('showContent', { index });
		},
	},


});
