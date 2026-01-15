// import { componentLoader } from './src/admin/component-loader';

// import path from 'node:path'
// import { bundle } from '@adminjs/bundler'
import { componentLoader } from './src/common/adminjs/components'

;(async () => {
	const { bundle } = await import('@adminjs/bundler')

	await bundle({
		componentLoader,
		destinationDir: 'public/admin' // Output directory for bundles
	})
})()
