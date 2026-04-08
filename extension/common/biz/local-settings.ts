export
interface I_local_settings {
	voice: string | null
	rate: number | null
}

export
async function get_local_settings(): Promise<I_local_settings> {
	const opts = await chrome.storage.local.get(['voice', 'rate'])
	const voice = typeof(opts.voice) === 'string'
		? opts.voice : null
	const rate = (typeof(opts.rate) === 'number' && 0.5 <= opts.rate && opts.rate <= 2)
		? opts.rate : .8
	const settings = { voice, rate }
	console.log('PROB: getting local settings', settings)
	return settings
}

export
async function save_local_settings(settings: I_local_settings) {
	console.log('PROB: saving local settings', settings)
	await chrome.storage.local.set(settings)
}
