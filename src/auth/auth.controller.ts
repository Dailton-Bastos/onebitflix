import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseGuards
} from '@nestjs/common'
import type { Response } from 'express'
import { CurrentUser } from 'src/common/decorators'
import { Serialize } from 'src/common/interceptors'
import { CreateUserDto, UserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { AuthService } from './auth.service'
import { JwtLogoutAuthGuard } from './guards/jwt-logout-auth.guard'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.authService.register(createUserDto)
	}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	async login(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.login(user, response)
	}

	@Post('refresh')
	@UseGuards(JwtRefreshAuthGuard)
	@HttpCode(HttpStatus.OK)
	async refresh(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.login(user, response)
	}

	@Post('logout')
	@UseGuards(JwtLogoutAuthGuard)
	@HttpCode(HttpStatus.OK)
	async logout(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.logout(user, response)
	}
}
