import { configService } from 'src/config/dotenv.config'

export const jwtConstants = {
	secret: configService.getOrThrow<string>('JWT_SECRET'),
	issuer: configService.getOrThrow<string>('JWT_ISSUER'),
	audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
	expiresIn: Number(configService.getOrThrow<number>('JWT_EXPIRES_IN'))
}
