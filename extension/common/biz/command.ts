export
enum commands_key {
	read_selection = 'read-selection',
}

export
function is_valid_command(command: string): command is commands_key {
	return Object.values(commands_key).includes(command as commands_key)
}
