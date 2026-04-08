/** 获取当前活动标签页 */
export
async function current_tab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		lastFocusedWindow: true,
	})
	if (tab && tab.id && tab?.url && /^https?:\/\//.test(tab.url))
		return tab as chrome.tabs.Tab & { id: number }
	return null
}

/** 订阅内置语音变化 */
export
class Built_in_voices {
	private v: SpeechSynthesisVoice[]
	private listeners: ((voices: SpeechSynthesisVoice[]) => void)[] = []
	constructor() {
		const get_en_voices = () =>
			speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'))
		this.v = get_en_voices()
		speechSynthesis.addEventListener('voiceschanged', () => {
			this.v = get_en_voices()
			this.listeners.forEach(l => l(this.v))
		})
	}
	get() {
		return this.v
	}
	get_default_voice(): SpeechSynthesisVoice | null {
		return this.get_by_uri('Samantha')
			|| this.v[0] || null
	}
	get_by_uri(uri: string) {
		return this.v.find(v => v.voiceURI === uri)
	}
	subscribe(cb: (voices: SpeechSynthesisVoice[]) => void) {
		this.listeners.push(cb)
	}
}
