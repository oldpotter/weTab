const config = require('../../config.js')
const app = getApp()
Page({
	data: {
		array: undefined,
		hiddenInput: true,
		position: undefined,
	},


	onLoad(options) {
		this.songId = options.songId
		if (options.index) {
			this.setData({ array: app.songs[options.index].tab })
			return
		}
		this.songName = options.songName
		const _this = this
		wx.request({
			url: `${config.service.lyricUrl}${this.songId}`,
			success: function (res) {
				if (res.statusCode == 200) {
					const obj = JSON.parse(res.data.data.body)
					const strLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '\n')
					// console.log(obj)
					let array = strLyric.split('\n')
					// console.log(array)

					array = array.map(item => {
						const blanks = []
						for (let i = 0; i < 20; i++) {
							blanks.push('&nbsp;'.repeat(4))
						}
						return item = {
							isBlank: item == '',
							value: item == '' ? blanks : item
						}
					})
					// console.log(array)
					_this.setData({ array })
				}
			},
			fail: function (res) {
				console.error(res)
			},
			complete: function (res) { },
		})
	},

	onClickChord(event) {
		this.setData({
			hiddenInput: false,
			position: event.currentTarget.dataset.position
		})
	},

	onClickCancel() {
		this.setData({ hiddenInput: true })
	},
	onClickConfirm(event) {
		// console.log('onClickConfirm:', event.detail.value)
		const chord = event.detail.value
		const position = this.data.position
		const rowIndex = position.split('-')[0]
		const columnIndex = position.split('-')[1]
		const param = `array[${rowIndex}].value[${columnIndex}]`
		console.log(param)
		this.setData({
			[param]: chord,
			hiddenInput: true,
		})
		console.log(this.data.array)
	},

	onClickSave() {
		const newSong = app.songs.every((song, index, songs) => {
			if (song.songId == this.songId) {
				songs[index].tab = this.data.array
				return false
			}
			return true
		})
		if (newSong) {
			app.songs.push({
				songId: this.songId,
				songName: this.songName,
				tab: this.data.array
			})
		}
		wx.setStorage({
			key: 'songs',
			data: app.songs,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},

})