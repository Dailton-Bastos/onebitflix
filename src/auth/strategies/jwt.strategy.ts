import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from 'src/common/constants'
import { TokenPayload } from 'src/common/interfaces'
import cookiesConfig from 'src/config/cookies.config'
import { UsersService } from 'src/users/users.service'

interface RequestWithJwtToken extends Request {
	cookies: {
		access_token: string
	}
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly usersService: UsersService,
		@Inject(cookiesConfig.KEY)
		private readonly config: ConfigType<typeof cookiesConfig>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: RequestWithJwtToken) => {
					return this.extractTokenFromRequest(request)
				}
			]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret
		})
	}

	async validate(payload: TokenPayload) {
		return this.usersService.findByEmail(payload.email)
	}

	private extractTokenFromRequest(request: RequestWithJwtToken): string | null {
		const authorizationHeader =
			request.headers?.authorization?.split(' ')[1] ?? null

		const cookie = request.cookies?.[this.config.accessToken.name] ?? null

		return cookie || authorizationHeader
	}
}
