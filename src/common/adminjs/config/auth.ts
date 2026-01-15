import { configService } from 'src/config/doenv.config'
import { authProvider } from './auth-provider'

export const auth = {
	cookieName: configService.getOrThrow<string>('ADMINJS_COOKIE_NAME'),
	cookiePassword: configService.getOrThrow<string>('ADMINJS_COOKIE_PASSWORD'),
	provider: authProvider
}
