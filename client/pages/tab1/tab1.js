const config = require('../../config.js')
Page({
	data: {
		array: undefined,
		hiddenInput: true,
		position: undefined
	},

	onLoad() {
		const _this = this
		wx.request({
			url: `${config.service.lyricUrl}?id=33894312`,
			success: function (res) {
				if (res.statusCode == 200) {
					const obj = JSON.parse(res.data.data.body)
					const strLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '\n')
					// console.log(strLyric)
					let array = strLyric.split('\n')
					// console.log(array)
					const blanks = []
					for (let i = 0; i < 20; i++) {
						blanks.push('&nbsp;'.repeat(2))
					}
					array = array.map(item => item = {
						isBlank: item == '',
						value: item == '' ? blanks : item
					})
					console.log(array)
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
		this.setData({
			[param]: chord,
			hiddenInput:true,
		})
	},

})