// @ts-check
import { build } from 'esbuild'
import fs from 'fs'

fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist/settings-page', { recursive: true })
fs.cpSync('extension/settings-page/index.html', 'dist/settings-page/index.html')
fs.cpSync('extension/manifest.json', 'dist/manifest.json')
fs.cpSync('extension/icon', 'dist/icon', { recursive: true })

build({
	entryPoints: [
		'extension/content.ts',
		'extension/background.ts',
		'extension/settings-page/index.ts',
	],
	bundle: true,
	outdir: 'dist',
})
