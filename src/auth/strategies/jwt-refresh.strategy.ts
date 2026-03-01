import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from 'src/common/constants'
import { TokenPayload } from 'src/common/interfaces'
import { AuthService } from '../auth.service'

interface RequestWithRefreshToken extends Request {
	cookies: {
		refresh_token: string
	}
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: RequestWithRefreshToken) => {
					return request?.cookies?.refresh_token
				}
			]),
			ignoreExpiration: false,
			passReqToCallback: true,
			secretOrKey: jwtConstants.refreshSecret
		})
	}

	async validate(request: RequestWithRefreshToken, payload: TokenPayload) {
		return this.authService.verifyRefreshToken(
			request.cookies.refresh_token,
			payload.sub
		)
	}
}
