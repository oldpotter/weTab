const app = getApp()
Page({
	data: {
		songs: undefined
	},

	onLoad() {
		this.setData({ songs: app.songs })
	},

	onClickSong(event){
		const index = event.currentTarget.dataset.index
		wx.navigateTo({
			url: `../edit/edit?index=${index}&songId=${app.songs[index].songId}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	}
})