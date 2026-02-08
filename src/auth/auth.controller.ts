import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards
} from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators'
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
	@HttpCode(HttpStatus.OK)
	async login(@CurrentUser() user: User) {
		return this.authService.login(user)
	}
}
