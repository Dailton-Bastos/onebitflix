import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException
} from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import type { Response } from 'express'
import { jwtConstants } from 'src/common/constants'
import { HashingService } from 'src/common/hashing/hashing.service'
import { TokenPayload } from 'src/common/interfaces'
import { addMilliseconds } from 'src/common/utils'
import cookiesConfig from 'src/config/cookies.config'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { MoreThan, Repository } from 'typeorm'
import { RefreshToken } from './refresh-token.entity'

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		private readonly usersService: UsersService,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService,
		@Inject(cookiesConfig.KEY)
		private readonly config: ConfigType<typeof cookiesConfig>,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepository: Repository<RefreshToken>
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

		const refreshToken = await this.createRefreshToken(payload)

		response.cookie(this.config.accessToken.name, token, {
			...this.config.accessToken.options
		})

		response.cookie(this.config.refreshToken.name, refreshToken, {
			...this.config.refreshToken.options
		})

		return {
			access_token: token,
			refresh_token: refreshToken
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

	async verifyRefreshToken(token: string, userId: number): Promise<User> {
		const existingRefreshToken = await this.refreshTokenRepository.findOne({
			where: {
				user: { id: userId },
				isRevoked: false,
				expiresAt: MoreThan(new Date())
			},
			select: {
				user: true
			},
			relations: {
				user: true
			}
		})

		if (!existingRefreshToken)
			throw new UnauthorizedException('invalid refresh token')

		let isTokenValid: boolean = false

		try {
			isTokenValid = await this.hashingService.verify(
				token,
				existingRefreshToken.token
			)
		} catch (error) {
			if (error?.message.includes('Invalid refresh token')) {
				throw new BadRequestException('invalid refresh token')
			}

			throw new InternalServerErrorException(
				'an error occurred while verifying the refresh token'
			)
		}

		if (!isTokenValid) throw new UnauthorizedException('invalid refresh token')

		return existingRefreshToken.user
	}

	async createRefreshToken(payload: TokenPayload): Promise<string> {
		await this.revokeRefreshToken(payload.sub)

		const refreshToken = this.jwtService.sign<TokenPayload>(payload, {
			expiresIn: jwtConstants.refreshExpiresIn,
			secret: jwtConstants.refreshSecret
		})

		const hashedRefreshToken = await this.hashingService.hash(refreshToken)

		const expiresAt = addMilliseconds(
			new Date(),
			jwtConstants.refreshExpiresIn * 1000
		)

		const data = this.refreshTokenRepository.create({
			user: { id: payload.sub },
			token: hashedRefreshToken,
			expiresAt
		})

		await this.refreshTokenRepository.save(data)

		return refreshToken
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		timeZone: 'UTC',
		name: 'deleteUnusedRefreshTokens'
	})
	async deleteUnusedRefreshTokens(): Promise<void> {
		this.logger.debug('Deleting unused refresh tokens 🕐...')
		try {
			await this.refreshTokenRepository
				.createQueryBuilder()
				.delete()
				.from(RefreshToken)
				.where('expires_at < :now', { now: new Date() })
				.orWhere('is_revoked = true')
				.execute()
			this.logger.debug('Unused refresh tokens deleted successfully 🎉')
		} catch {
			this.logger.error('Failed to delete unused refresh tokens 💥')

			throw new InternalServerErrorException(
				'an error occurred while deleting unused refresh tokens'
			)
		}
	}

	private async revokeRefreshToken(userId: number): Promise<void> {
		await this.refreshTokenRepository.update(
			{ user: { id: userId } },
			{ isRevoked: true }
		)
	}
}
