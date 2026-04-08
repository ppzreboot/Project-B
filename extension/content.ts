import { get_local_settings, Built_in_voices, DEFAULT_RATE, commands_key } from './common'

let utterance: SpeechSynthesisUtterance | null = null
const built_in_voices = new Built_in_voices()
	
async function read() {
	const text = get_selected_text()
	if (text)
		utterance = new SpeechSynthesisUtterance(text)
	if (utterance === null)
		throw new Error('No content to read')

	const settings = await get_local_settings()
	speechSynthesis.cancel()
	utterance.lang = 'en-US'
	utterance.rate = settings.rate || DEFAULT_RATE
	if (settings.voice) {
		const voice = 
			built_in_voices.get_by_uri(settings.voice)
			|| built_in_voices.get_default_voice()
		if (voice)
			utterance.voice = voice
	}

	speechSynthesis.speak(utterance)
}

function get_selected_text() {
	const selection = window.getSelection()
	if (selection === null)
		return null
	const selected_text = selection.toString().trim()
	if (selected_text.length === 0)
		return null
	return selected_text
}

chrome.runtime.onMessage.addListener((msg): undefined => {
	switch (msg?.type) {
		case commands_key.read_selection:
			read()
			return
		default:
			console.error('PROB: invalid message', msg)
			throw new Error('Invalid message')
	}
})
