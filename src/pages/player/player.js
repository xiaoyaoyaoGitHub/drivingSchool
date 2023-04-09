Page({
	data: {
		playerUrl: '',
	},
	onLoad(query) {
		const {playerUrl} = query || {};
		this.setData({playerUrl});
	},
});
