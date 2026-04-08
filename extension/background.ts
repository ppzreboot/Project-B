import { current_tab } from './common'

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

chrome.action.onClicked.addListener(() => {
	chrome.runtime.openOptionsPage()
})
