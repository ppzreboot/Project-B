function read_selection() {
	const text = window.getSelection()?.toString().trim()
	if (!text) return

	window.speechSynthesis.cancel()
	const utterance = new SpeechSynthesisUtterance(text)
	utterance.lang = 'en-US'
	utterance.rate = 1
	window.speechSynthesis.speak(utterance)
}

chrome.runtime.onMessage.addListener((msg) => {
	if (msg?.type === 'read-selection') {
		read_selection()
	}
})
