import path from 'node:path'
import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const componentsPath = path.join(process.cwd(), 'src/common/adminjs/components')

const Components = {
	Dashboard: componentLoader.add(
		'Dashboard',
		path.join(componentsPath, 'Dashboard/index.tsx')
	)
}

export { componentLoader, Components }
