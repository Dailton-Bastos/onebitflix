import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { Response } from 'express'
import { HashingService } from 'src/common/hashing/hashing.service'
import { TokenPayload } from 'src/common/interfaces'
import cookiesConfig from 'src/config/cookies.config'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService,
		@Inject(cookiesConfig.KEY)
		private readonly config: ConfigType<typeof cookiesConfig>
	) {}

	async register(createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto)
	}

	async login(user: User, response: Response) {
		const payload: TokenPayload = {
			sub: user.id,
			email: user.email
		}

		const token = this.jwtService.sign<TokenPayload>(payload)

		response.cookie(this.config.accessToken.name, token, {
			...this.config.accessToken.options
		})

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
