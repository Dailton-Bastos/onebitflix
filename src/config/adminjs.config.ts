import { AdminModuleOptions } from '@adminjs/nestjs'
import { registerAs } from '@nestjs/config'
import { configService } from './doenv.config'

const DEFAULT_ADMIN = {
	email: configService.getOrThrow<string>('ADMINJS_DEFAULT_EMAIL'),
	password: configService.getOrThrow<string>('ADMINJS_DEFAULT_PASSWORD')
}

export const adminjsConfig = registerAs(
	'adminjs',
	() =>
		({
			adminJsOptions: {
				rootPath: '/admin',
				resources: [],
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
				}
			},
			auth: {
				cookieName: configService.getOrThrow<string>('ADMINJS_COOKIE_NAME'),
				cookiePassword: configService.getOrThrow<string>(
					'ADMINJS_COOKIE_PASSWORD'
				),
				authenticate: async (email: string, password: string) => {
					if (
						email === DEFAULT_ADMIN.email &&
						password === DEFAULT_ADMIN.password
					) {
						return Promise.resolve(DEFAULT_ADMIN)
					}

					return null
				}
			},
			sessionOptions: {
				resave: true,
				saveUninitialized: true,
				secret: configService.getOrThrow<string>('ADMINJS_SESSION_SECRET')
			}
		}) as AdminModuleOptions
)
