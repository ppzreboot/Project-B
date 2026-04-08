import { h, text, patch } from 'superfine'
import { DEFAULT_RATE, Built_in_voices, get_local_settings, save_local_settings, I_local_settings } from '../common'

function render(props: {
	voice_list: SpeechSynthesisVoice[],
	settings: {
		voice: string | null,
		set_voice: (voice: string) => void,
		rate: number | null,
		set_rate: (rate: number) => void,
	}
}) {
	return h('div', {}, [
		h('div', { class: 'row' }, [
			h('label', {}, [
				h('span', {}, [
					text('语音（Voice）'),
				]),
				h('select', {
					value: props.settings.voice,
					onchange: (evt: Event) => {
						props.settings.set_voice((evt.target as HTMLSelectElement).value)
					},
				}, [
					...props.voice_list.map(v => h('option', { value: v.voiceURI }, [text(v.name)])),
				]),
			])
		]),
		h('div', { class: 'row' }, [
			h('label', {}, [
				h('span', {}, [
					text('语速（Rate）'),
					text('x' + (props.settings.rate || DEFAULT_RATE)),
				]),
				h('input', {
					type: 'range', min: '0.5', max: '2.0', step: '0.1',
					value: props.settings.rate || DEFAULT_RATE,
					oninput: (evt: Event) => {
						props.settings.set_rate(Number((evt.target as HTMLInputElement).value))
					},
				}),
			]),
		])
	])
}

async function init() {
	console.log('init options page')
	const built_in_voices = new Built_in_voices()
	const _patch = async () => {
		const voice_list = built_in_voices.get()
		const state = await get_local_settings()
		patch(
			document.getElementById('app'),
			render({
				voice_list,
				settings: {
					voice: state.voice,
					set_voice: async v => {
						await save_local_settings({
							...state,
							voice: v,
						})
						_patch()
					},
					rate: state.rate,
					set_rate: async v => {
						await save_local_settings({
							...state,
							rate: v,
						})
						_patch()
					}
				}
			})
		)
	}

	_patch()
	built_in_voices.subscribe(_patch)
}

init()
