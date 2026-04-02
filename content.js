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

let last_utterance = null
async function read_selection() {
	window.speechSynthesis.cancel()
	const text = window.getSelection()?.toString().trim()
	if (!text) {
		if (last_utterance === null)
			return
		else {
			window.speechSynthesis.speak(last_utterance)
			return
		}
	}
	console.log('reading selection:', text)

	const opts = await load_settings()
	const voice = get_selected_voice(opts.voice)

	last_utterance = new SpeechSynthesisUtterance(text)
	last_utterance.lang = 'en-US'
	last_utterance.rate = opts.rate ?? 1
	last_utterance.voice = voice

	window.speechSynthesis.speak(last_utterance)
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
