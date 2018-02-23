const config = require('../../config.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
	data: {
		array: undefined,
		hiddenInput: true,
		position: undefined,
		isEditing: false,
		scales: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'],
		kinds: ['dim', 'aug', '3', '4', '5', '6', '7', '9', '11', '13', 'sus2', 'sus4', '-', '+', '/'],
		resChord:undefined,
	},

	onLoad(options) {
		this.songId = options.songId
		if (options.index) {//本地数据
			this.setData({ array: app.songs[options.index].tab })
			return
		}
		this.songName = options.songName
		const _this = this
		wx.showLoading({
			title: '',
			mask: true,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
		wx.request({
			url: `${config.service.lyricUrl}${this.songId}`,
			success: function (res) {
				if (res.statusCode == 200) {
					const obj = JSON.parse(res.data.data.body)
					const strLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '\n')
					let array = strLyric.split('\n')
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
					_this.setData({ array })
				}
			},
			fail: function (res) {
				console.error(res)
			},
			complete: function (res) {
				wx.hideLoading()
			},
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

	onClickEdit() {
		const isEditing = !this.data.isEditing
		this.setData({ isEditing })
	},

	onClickDeleteLyric(event) {
		const index = event.currentTarget.dataset.position
		// console.log(this.data.array[index - 1])
		// console.log(this.data.array[index])
		const array = this.data.array
		array.splice(index - 1, 2)
		// console.log(array)
		this.setData({ array })
	},

	onClickScaleItem(event){
		const chord = event.currentTarget.dataset.chord
		let resChord = this.data.resChord || ''
		resChord = resChord + chord
		this.setData({resChord})
	},

	onClickEditChord(){
		
	},

	onClickDeleteChord(){
		this.setData({
			resChord:''
		})
	},
	onClickCloseInput(){
		this.setData({
			hiddenInput: true,			
		})
	}
})