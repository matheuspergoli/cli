import color from 'picocolors'
import * as p from '@clack/prompts'
import { setTimeout } from 'node:timers/promises'
import { createProjectDir, installDependencies } from './utils.js'

async function main() {
	console.clear()

	await setTimeout(1000)

	p.intro(`${color.bgCyan(color.black(' create-app '))}`)

	const project = await p.group(
		{
			path: () =>
				p.text({
					message: 'Where should we create your project?',
					placeholder: './my-app',
					validate: (value) => {
						if (!value) return 'Please enter a path.'
						if (value[0] !== '.') return 'Please enter a relative path.'
					}
				}),
			type: ({ results }) =>
				p.select({
					message: `Pick a project type within "${results.path}"`,
					initialValue: 'next',
					maxItems: 5,
					options: [
						{ value: 'next', label: 'NextJS' },
						{ value: 'react-ts', label: 'React with TS' },
						{ value: 'react-js', label: 'React with JS' },
						{ value: 'js', label: 'Javascript' },
						{ value: 'ts', label: 'Typescript' }
					]
				}),
			packageManager: ({ results }) =>
				p.select({
					message: 'Pick a package manager.',
					initialValue: 'pnpm',
					options: [
						{ value: 'pnpm', label: 'pnpm', hint: 'recommended' },
						{ value: 'npm', label: 'npm' }
					]
				})
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.')
				process.exit(0)
			}
		}
	)

	const s = p.spinner()

	s.start('Creating project')
	await createProjectDir(project.path)
	await installDependencies(project.path, project.type, project.packageManager)
	s.stop('Project created')

	let nextSteps = `cd ${process.cwd()}/${project.path.replace('./', '')} && ${
		project.type === 'next' ? 'pnpm' : project.packageManager
	} run dev`

	p.note(nextSteps, 'Next steps.')
}

main().catch(console.error)
