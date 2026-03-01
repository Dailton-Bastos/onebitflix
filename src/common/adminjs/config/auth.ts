import { configService } from 'src/config/dotenv.config'
import { authProvider } from './auth-provider'

export const auth = {
	cookieName: configService.getOrThrow<string>('ADMINJS_COOKIE_NAME'),
	cookiePassword: configService.getOrThrow<string>('ADMINJS_COOKIE_PASSWORD'),
	provider: authProvider
}
