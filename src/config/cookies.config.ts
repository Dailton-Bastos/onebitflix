import { registerAs } from '@nestjs/config'
import { jwtConstants } from 'src/common/constants'
import { configService } from './dotenv.config'

export default registerAs('cookies', () => {
	const accessTokenMaxAge =
		Number(configService.getOrThrow<number>('JWT_EXPIRES_IN')) * 1000

	const refreshTokenMaxAge =
		Number(configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN')) * 1000

	return {
		secret:
			configService.getOrThrow<string>('COOKIES_SECRET')?.split(',') ?? [],
		accessToken: {
			name: jwtConstants.accessTokenName,
			options: {
				httpOnly: true,
				secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
				maxAge: accessTokenMaxAge // 1 hour
			}
		},
		refreshToken: {
			name: jwtConstants.refreshTokenName,
			options: {
				httpOnly: true,
				secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
				maxAge: refreshTokenMaxAge // 1 day
			}
		}
	}
})
