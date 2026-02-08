import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { Serialize } from 'src/common/interceptors'
import { CreateUserDto, UserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { AuthService } from './auth.service'
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
	async login(@Request() req: Express.Request) {
		return req.user
	}
}
