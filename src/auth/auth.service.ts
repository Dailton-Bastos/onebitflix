import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HashingService } from 'src/common/hashing/hashing.service'
import { TokenPayload } from 'src/common/interfaces'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService
	) {}

	async register(createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto)
	}

	async login(user: User) {
		const payload: TokenPayload = {
			sub: user.id,
			email: user.email
		}

		const token = this.jwtService.sign<TokenPayload>(payload)

		return {
			access_token: token
		}
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
