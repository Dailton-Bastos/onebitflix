import { AdminModuleOptions } from '@adminjs/nestjs'
import { dark, light, noSidebar } from '@adminjs/themes'
import { registerAs } from '@nestjs/config'
import { dashboardHandler } from 'src/common/adminjs/components/dashboardHandler'
import { Components, componentLoader } from '../common/adminjs/components'
import { auth } from '../common/adminjs/config/auth'
import { branding } from '../common/adminjs/config/branding'
import { locale } from '../common/adminjs/config/locale'
import { sessionOptions } from '../common/adminjs/config/session-options'
import { resourceWithOptions } from '../common/adminjs/resources'
import dataSource from './data-source.config'

export const adminjsConfig = registerAs('adminjs', async () => {
	if (!dataSource.isInitialized) {
		await dataSource.initialize()
	}

	const resources = await resourceWithOptions()

	return {
		adminJsOptions: {
			rootPath: '/admin',
			resources,
			branding,
			defaultTheme: light.id,
			availableThemes: [dark, light, noSidebar],
			componentLoader,
			dashboard: {
				component: Components.Dashboard,
				handler: dashboardHandler
			},
			locale
		},
		auth,
		sessionOptions
	} as AdminModuleOptions
})
