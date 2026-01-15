import { AdminModuleOptions } from '@adminjs/nestjs'
import { dark, light, noSidebar } from '@adminjs/themes'
import { registerAs } from '@nestjs/config'
import argon2 from '@node-rs/argon2'
import { type CurrentAdmin, DefaultAuthProvider } from 'adminjs'
import { dashboardHandler } from 'src/common/adminjs/components/Dashboard/dashboardHandler'
import { Components, componentLoader } from '../common/adminjs/components'
import ptBRLocale from '../common/adminjs/i18n/pt-BR'
import { resourceWithOptions } from '../common/adminjs/resources'
import { UserRole } from '../common/constants'
import { User } from '../users/user.entity'
import dataSource from './data-source.config'
import { configService } from './doenv.config'

const authenticate = async ({
	email,
	password
}: {
	email: string
	password: string
}) => {
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}

		const repository = dataSource.getRepository(User)

		const user = await repository.findOne({ where: { email } })

		if (user && user.role === UserRole.ADMIN) {
			const isPasswordValid = await argon2.verify(user.password, password)

			if (!isPasswordValid) return null

			const currentAdmin: CurrentAdmin = {
				id: user.id.toString(),
				email: user.email,
				title: `${user?.firstName ?? user?.email}`,
				theme: light.id
			}

			return currentAdmin
		}

		return null
	} catch {
		return null
	}
}

const authProvider = new DefaultAuthProvider({ componentLoader, authenticate })

export const adminjsConfig = registerAs('adminjs', async () => {
	const resources = await resourceWithOptions(componentLoader)

	return {
		adminJsOptions: {
			rootPath: '/admin',
			resources,
			branding: {
				companyName: 'OneBitFlix',
				logo: '/public/logoOnebitflix.svg',
				theme: {
					colors: {
						primary100: '#ff0043',
						primary80: '#ff1a57',
						primary60: '#ff3369',
						primary40: '#ff4d7c',
						primary20: '#ff668f',
						grey100: '#151515',
						grey80: '#333333',
						grey60: '#4d4d4d',
						grey40: '#666666',
						grey20: '#dddddd',
						filterBg: '#333333',
						accent: '#151515',
						hoverBg: '#151515'
					}
				}
			},
			defaultTheme: light.id,
			availableThemes: [dark, light, noSidebar],
			componentLoader,
			dashboard: {
				component: Components.Dashboard,
				handler: dashboardHandler
			},
			locale: {
				language: 'pt-BR',
				availableLanguages: ['pt-BR', 'en'],
				translations: {
					'pt-BR': ptBRLocale
				}
			}
		},
		auth: {
			cookieName: configService.getOrThrow<string>('ADMINJS_COOKIE_NAME'),
			cookiePassword: configService.getOrThrow<string>(
				'ADMINJS_COOKIE_PASSWORD'
			),
			provider: authProvider
		},
		sessionOptions: {
			resave: true,
			saveUninitialized: true,
			secret: configService.getOrThrow<string>('ADMINJS_SESSION_SECRET'),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24, // 1 day
				httpOnly: true,
				secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
				sameSite: 'strict'
			}
		}
	} as AdminModuleOptions
})
