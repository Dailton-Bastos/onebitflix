import { registerAs } from '@nestjs/config'
import type { JwtModuleOptions } from '@nestjs/jwt'
import { jwtConstants } from 'src/common/constants'

export default registerAs(
	'jwt',
	() =>
		({
			secret: jwtConstants.secret,
			signOptions: {
				audience: jwtConstants.audience,
				issuer: jwtConstants.issuer,
				expiresIn: jwtConstants.expiresIn
			}
		}) as JwtModuleOptions
)
