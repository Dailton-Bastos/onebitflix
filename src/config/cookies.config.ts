import { registerAs } from '@nestjs/config'
import { jwtConstants } from 'src/common/constants'
import { addMilliseconds } from 'src/common/utils'
import { configService } from './dotenv.config'

const accessTokenExpiresInMs =
	Number(configService.getOrThrow<number>('JWT_EXPIRES_IN')) * 1000

const refreshTokenExpiresInMs =
	Number(configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN')) * 1000

export default registerAs('cookies', () => ({
	secret: configService.getOrThrow<string>('COOKIES_SECRET')?.split(',') ?? [],
	accessToken: {
		name: jwtConstants.accessTokenName,
		options: {
			httpOnly: true,
			secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
			expires: addMilliseconds(new Date(), accessTokenExpiresInMs) // 1 hour
		}
	},
	refreshToken: {
		name: jwtConstants.refreshTokenName,
		options: {
			httpOnly: true,
			secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
			expires: addMilliseconds(new Date(), refreshTokenExpiresInMs) // 1 day
		}
	}
}))
