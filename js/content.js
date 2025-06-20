async function run() {
	showLoadingOverlay()
	try {
		await playFirstTrack()
		await handleQueuePanel()
		await scrollToBottomQueue()
		await handleQueuePanel()
		await shuffleTracks()
	} finally {
		hideLoadingOverlay()
	}
}

async function playFirstTrack() {
	const trackList =
		document.querySelector('ul.lazyLoadingList__list') ||
		document.querySelector('ul.trackList__list')
	if (!trackList) {
		console.warn(`Track list isn't found.`)
		return
	}

	const firstTrack = trackList.querySelector('li')

	const playButton = firstTrack.querySelector('a[title="Play"]')
	if (!playButton) {
		console.warn(`Play button isn't found.`)
		return
	}

	playButton.click()
	await delay(1000)
}

async function handleQueuePanel() {
	const shuffleButton = document.querySelector('button[title="Shuffle"]')
	if (shuffleButton.classList.contains('m-shuffling')) {
		shuffleButton.click()
		await delay(1000)
	}

	const queueButton = document.querySelector('a[title="Next up"]')
	if (!queueButton) {
		console.warn(`Queue button isn't found.`)
		return
	}

	// if (queueButton.classList.contains('m-queueVisible')) {
	// 	queueButton.click()
	// 	await delay(500)
	// }

	queueButton.click()
	await delay(1000)
}

async function scrollToBottomQueue() {
	const scrollable = document.querySelector('div.queue__scrollableInner')
	let lastHeight = scrollable.scrollHeight
	let tryCount = 0

	return new Promise(resolve => {
		const interval = setInterval(() => {
			scrollable.scrollBy(0, 1444)

			const currentHeight = scrollable.scrollHeight
			if (currentHeight === lastHeight) {
				tryCount++
				if (tryCount >= 8) {
					clearInterval(interval)
					resolve(true)
				}
			} else {
				tryCount = 0
				lastHeight = currentHeight
			}
		}, 500)
	})
}

async function shuffleTracks() {
	const shuffleButton = document.querySelector('button[title="Shuffle"]')
	if (shuffleButton) {
		shuffleButton.click()
	} else {
		console.warn(`Shuffle button isn't found.`)
	}
	await delay(1000)
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'runSoundCloudShuffle') {
		run()
		sendResponse({ success: true })
	}
})

function showLoadingOverlay() {
	const existing = document.getElementById('overlay')
	if (existing) return

	const overlay = document.createElement('div')
	overlay.id = 'overlay'
	overlay.style.position = 'fixed'
	overlay.style.top = '0'
	overlay.style.left = '0'
	overlay.style.width = '100vw'
	overlay.style.height = '100vh'
	overlay.style.display = 'flex'
	// overlay.style.flexDirection = 'column'
	// overlay.style.gap = '4px'
	overlay.style.justifyContent = 'center'
	overlay.style.alignItems = 'center'
	overlay.style.zIndex = '4444'
	overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
	overlay.style.backdropFilter = 'blur(4px)'
	overlay.style.webkitBackdropFilter = 'blur(4px)'
	overlay.style.transition = 'opacity 0.5s ease'
	// overlay.style.opacity = '0'
	// requestAnimationFrame(() => {
	// 	overlay.style.opacity = '1'
	// })

	// const text = document.createElement('p')
	// text.style.fontSize = '1rem'
	// text.style.fontWeight = 'bold'
	// text.style.textAlign = 'center'
	// text.textContent = `Please, st4y on this tab for a successful shuffle.`
	// overlay.appendChild(text)

	const gif = document.createElement('img')
	gif.src = chrome.runtime.getURL('/assets/shuffle.gif')
	gif.style.maxWidth = '300px'
	gif.style.maxHeight = '300px'
	overlay.appendChild(gif)

	document.body.appendChild(overlay)
}

function hideLoadingOverlay() {
	const overlay = document.getElementById('overlay')
	if (!overlay) return
	overlay.style.opacity = '0'
	overlay.addEventListener(
		'transitionend',
		() => {
			overlay.remove()
		},
		{ once: true }
	)
}
