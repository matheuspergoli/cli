import fs from 'fs/promises'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

export async function createProjectDir(path) {
	await fs.mkdir(path, { recursive: true })
}

export async function installDependencies(path, projectType, packageManager) {
	let cmd
	const dashesForVite = packageManager === 'npm' && '--'

	switch (projectType) {
		case 'next':
			cmd = `cd ${path} && pnpm dlx create-next-app@latest --example https://github.com/matheuspergoli/next-template ./`
			break

		case 'react-ts':
			cmd = `cd ${path} && ${packageManager} create vite@latest ./ ${dashesForVite} --template react-ts && ${packageManager} install`
			break

		case 'react-js':
			cmd = `cd ${path} && ${packageManager} create vite@latest ./ ${dashesForVite} --template react && ${packageManager} install`

		case 'js':
			cmd = `cd ${path} && ${packageManager} create vite@latest ./ ${dashesForVite} --template vanilla && ${packageManager} install`
			break

		case 'ts':
			cmd = `cd ${path} && ${packageManager} create vite@latest ./ ${dashesForVite} --template vanilla-ts && ${packageManager} install`
			break

		default:
			break
	}

	const { stdout, stderr } = await execAsync(cmd)
}
