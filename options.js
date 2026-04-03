const voice_select = document.getElementById('voice')
const rate_input = document.getElementById('rate')
const rate_val_label = document.getElementById('rate-val')

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
	const opts_in_storage = { voice, rate }
	console.log({ opts_in_storage })
	return opts_in_storage
}

function render_voice_options() {
	const voices = speechSynthesis.getVoices()
	if (!voices?.length) return

	voice_select.innerHTML = ''
	for (const v of voices) {
		if (v.lang !== 'en-US')
			continue
		const opt = document.createElement('option')
		opt.value = v.voiceURI
		opt.textContent = `${v.name}`
		voice_select.appendChild(opt)
	}
}

function save_settings() {
	const opts = {
		voice: voice_select.value,
		rate: Number(rate_input.value),
	}
	console.log('saving', opts)
	chrome.storage.local.set(opts)
}

async function init() {
	console.log('init options page')
	const opts = await load_settings()

	const render_rate_label = rate => {
		rate_val_label.textContent = 'x' + rate
	}
	const render_rate = rate => {
		rate_input.value = rate
		render_rate_label(rate)
	}

	render_voice_options()
	if (opts.voice)
		voice_select.value = opts.voice
	render_rate(opts.rate || 1)

	rate_input.addEventListener('input', () => {
		save_settings()
		render_rate_label(rate_input.value)
	})
	voice_select.addEventListener('change', save_settings)

	speechSynthesis.addEventListener('voiceschanged', () => {
		console.log('test')
		render_voice_options()
		if (opts.voice)
			voice_select.value = opts.voice
	})
}

init()
