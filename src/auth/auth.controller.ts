import { Body, Controller, Post } from '@nestjs/common'
import { Serialize } from 'src/common/interceptors'
import { CreateUserDto, UserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { AuthService } from './auth.service'

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.authService.register(createUserDto)
	}
}
