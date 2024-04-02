
Component({
	data: {
		selected: 0,
		color: '#1D1D1F',
		selectedColor: '#E35700',
		list: [{
			pagePath: '/pages/index/index',
			iconPath: './../images/home.png',
			selectedIconPath: './../images/home_HL.png',
			text: '首页',
		}, {
			pagePath: '/pages/appointment/appointment',
			iconPath: './../images/yueke.png',
			selectedIconPath: './../images/yueke.png',
			text: '约课',
			isSpecial: true,
		}, {
			pagePath: '/pages/my/my',
			iconPath: './../images/my.png',
			selectedIconPath: './../images/my_HL.png',
			text: '我的',
		}],
	},
	attached() {
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset;
			const url = data.path;
			console.log(typeof data.index);
			console.log(typeof this.data.selected);
			wx.switchTab({ url });
		},
		catchDubbed() {
			getApp().catchDubbed();
		},
	},
});
