document.addEventListener('DOMContentLoaded', async () => {
	const goButton = document.getElementById('go')
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	const url = tab.url

	const isLikesPage = url.includes('soundcloud.com/you/likes')
	const isPlaylistPage = /^https:\/\/soundcloud\.com\/[^/]+\/sets\/[^/]+/.test(
		url
	)

	if (!isLikesPage && !isPlaylistPage) {
		goButton.disabled = true
		goButton.style.backgroundColor = 'black'
		goButton.style.cursor = 'not-allowed'
		// goButton.style.pointerEvents = 'none'
	} else {
		goButton.disabled = false
		goButton.addEventListener('click', () => {
			chrome.tabs.sendMessage(
				tab.id,
				{ action: 'runSoundCloudShuffle' },
				response => {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message)
					} else {
						if (response?.success) {
							window.close()
						}
					}
				}
			)
		})
	}
})
