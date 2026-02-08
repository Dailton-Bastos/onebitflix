import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import { HashingService } from 'src/common/hashing/hashing.service'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly hashingService: HashingService
	) {}

	async register(createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto)
	}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.usersService.findByEmail(email)

		if (!user) return null

		let passwordMatch: boolean = false

		try {
			passwordMatch = await this.hashingService.verify(password, user.password)
		} catch (error) {
			if (error?.message.includes('Invalid hashed password')) {
				throw new BadRequestException('invalid hashed password')
			}

			throw new InternalServerErrorException(
				'an error occurred while verifying the password'
			)
		}

		if (!passwordMatch) throw new UnauthorizedException('invalid credentials')

		return user
	}
}
