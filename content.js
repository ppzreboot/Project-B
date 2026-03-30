async function load_settings() {
	const opts = await chrome.storage.local.get(['voice', 'rate'])
	const voice = (typeof(opts.voice) === 'string')
		? opts.voice : null
	const rate = (
		typeof(opts.rate) === 'number'
		&& 0.5 <= opts.rate
		&& opts.rate <= 2
	)
		? opts.rate : null
	return { voice, rate }
}

async function read_selection() {
	const text = window.getSelection()?.toString().trim()
	if (!text) return
	window.speechSynthesis.cancel()
	console.log('reading selection:', text)

	const opts = await load_settings()
	const voice = get_selected_voice(opts.voice)

	const utterance = new SpeechSynthesisUtterance(text)
	utterance.lang = 'en-US'
	utterance.rate = opts.rate ?? 1
	utterance.voice = voice

	window.speechSynthesis.speak(utterance)
}

function get_selected_voice(voice) {
	const voices = speechSynthesis.getVoices()
	if (!voices?.length)
		throw new Error('No voices found')
	const get = uri => voices.find(v => v.voiceURI === uri)

	if (voice) {
		const settings_voice = get(voice)
		if (settings_voice)
			return settings_voice
	}
	const default_voice = get('Samantha')
	if (default_voice) return default_voice
	return voices[0]
}

chrome.runtime.onMessage.addListener((msg) => {
	if (msg?.type === 'read-selection') {
		read_selection()
	}
})
