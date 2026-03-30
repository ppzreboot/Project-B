async function current_tab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		lastFocusedWindow: true,
	})
	if (!tab?.id || !tab.url || !/^https?:\/\//.test(tab.url))
		return null
	return tab
}

const valid_commands = [
	'read-selection',
]

chrome.commands.onCommand.addListener(async command => {
	// 无效 command
	if (!valid_commands.includes(command))
		return
	// 无效 tab
	const tab = await current_tab()
	if (tab === null)
		return

	await chrome.tabs.sendMessage(tab.id, { type: command })
})
