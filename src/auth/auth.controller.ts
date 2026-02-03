import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.authService.register(createUserDto)
	}
}
