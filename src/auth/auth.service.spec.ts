import {
	BadRequestException,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import type { Response } from 'express'
import { jwtConstants } from 'src/common/constants'
import { HashingService } from 'src/common/hashing/hashing.service'
import { TokenPayload } from 'src/common/interfaces'
import cookiesConfig from 'src/config/cookies.config'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import {
	HashingServiceMock,
	UserRepositoryMock,
	UsersServiceMock,
	userMock
} from 'src/users/users.service.mock'
import { MoreThan, Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { JwtServiceMock, RefreshTokenRepositoryMock } from './auth.service.mock'
import { RefreshToken } from './refresh-token.entity'

describe('AuthService', () => {
	let service: AuthService
	let usersService: UsersService
	let userRepository: Repository<User>
	let hashingService: HashingService
	let jwtService: JwtService
	let refreshTokenRepository: Repository<RefreshToken>
	let config: ConfigType<typeof cookiesConfig>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersServiceMock,
				UserRepositoryMock,
				HashingServiceMock,
				JwtServiceMock,
				RefreshTokenRepositoryMock,
				{
					provide: cookiesConfig.KEY,
					useValue: {
						accessToken: {
							name: jwtConstants.accessTokenName,
							options: {
								httpOnly: true
							}
						},
						refreshToken: {
							name: jwtConstants.refreshTokenName,
							options: {
								httpOnly: true
							}
						}
					}
				}
			]
		}).compile()

		service = module.get<AuthService>(AuthService)
		usersService = module.get<UsersService>(UsersService)
		userRepository = module.get<Repository<User>>(getRepositoryToken(User))
		hashingService = module.get<HashingService>(HashingService)
		jwtService = module.get<JwtService>(JwtService)
		refreshTokenRepository = module.get<Repository<RefreshToken>>(
			getRepositoryToken(RefreshToken)
		)
		config = module.get<ConfigType<typeof cookiesConfig>>(cookiesConfig.KEY)
		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(usersService).toBeDefined()
		expect(userRepository).toBeDefined()
		expect(hashingService).toBeDefined()
		expect(jwtService).toBeDefined()
		expect(refreshTokenRepository).toBeDefined()
		expect(config).toBeDefined()
	})

	describe('register', () => {
		it('should register a new user correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			const result = await service.register(dto)

			expect(usersService.create).toHaveBeenCalledWith(dto)

			expect(result).toEqual(userMock)
		})
	})

	describe('validateUser', () => {
		it('should validate a user correctly', async () => {
			const email = userMock.email
			const password = '1234567890'

			const result = await service.validateUser(email, password)

			expect(usersService.findByEmail).toHaveBeenCalledWith(email)
			expect(hashingService.verify).toHaveBeenCalledWith(
				password,
				userMock.password
			)
			expect(result).toEqual(userMock)
		})

		it('should return null if the user is not found', async () => {
			const email = 'test@test.com'
			const password = '1234567890'

			jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null)

			const result = await service.validateUser(email, password)

			expect(usersService.findByEmail).toHaveBeenCalledWith(email)
			expect(result).toBeNull()
		})

		it('should throw an error if the password is incorrect', async () => {
			const email = userMock.email
			const password = '1234567890'

			jest.spyOn(hashingService, 'verify').mockResolvedValue(false)
			jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userMock)

			await expect(service.validateUser(email, password)).rejects.toThrow(
				UnauthorizedException
			)

			expect(usersService.findByEmail).toHaveBeenCalledWith(email)
			expect(hashingService.verify).toHaveBeenCalledWith(
				password,
				userMock.password
			)
		})

		it('should throw an error if user password is not hashed', async () => {
			jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
				...userMock,
				password: 'not-hashed-password'
			} as User)

			jest.spyOn(hashingService, 'verify').mockImplementation(() => {
				throw new Error(
					'Invalid hashed password: password hash string missing field'
				)
			})

			await expect(
				service.validateUser(userMock.email, '1234567890')
			).rejects.toThrow(BadRequestException)

			expect(usersService.findByEmail).toHaveBeenCalledWith(userMock.email)
			expect(hashingService.verify).toHaveBeenCalledWith(
				'1234567890',
				'not-hashed-password'
			)
		})

		it('should throw an error if an error occurs while verifying the password', async () => {
			jest.spyOn(hashingService, 'verify').mockImplementation(() => {
				throw new Error('an error occurred while verifying the password')
			})

			await expect(
				service.validateUser(userMock.email, '1234567890')
			).rejects.toThrow(InternalServerErrorException)
		})
	})

	describe('login', () => {
		const response = {
			cookie: jest.fn()
		} as unknown as Response

		it('should generate access token correctly', async () => {
			const payload: TokenPayload = {
				sub: userMock.id,
				email: userMock.email
			}

			const result = await service.login(userMock, response)

			expect(jwtService.sign).toHaveBeenCalledWith(payload)
			expect(response.cookie).toHaveBeenCalledWith(
				config.accessToken.name,
				expect.any(String),
				{
					...config.accessToken.options
				}
			)

			expect(result.access_token).toBeDefined()
			expect(result.access_token).toBe('mock-token')
		})

		it('should generate refresh token correctly', async () => {
			const payload: TokenPayload = {
				sub: userMock.id,
				email: userMock.email
			}

			const result = await service.login(userMock, response)

			jest
				.spyOn(hashingService, 'hash')
				.mockResolvedValue('hashed-refresh-token')

			expect(refreshTokenRepository.update).toHaveBeenCalledWith(
				{ user: { id: userMock.id } },
				{ isRevoked: true }
			)
			expect(jwtService.sign).toHaveBeenCalledWith(payload, {
				expiresIn: jwtConstants.refreshExpiresIn,
				secret: jwtConstants.refreshSecret
			})
			expect(hashingService.hash).toHaveBeenCalledWith('mock-token')
			expect(refreshTokenRepository.create).toHaveBeenCalled()
			expect(refreshTokenRepository.save).toHaveBeenCalled()

			expect(result.refresh_token).toBeDefined()
			expect(result.refresh_token).toBe('mock-token')
		})

		it('should login a user correctly', async () => {
			const result = await service.login(userMock, response)

			expect(result).toEqual({
				access_token: expect.any(String),
				refresh_token: expect.any(String)
			})
		})
	})

	describe('verifyRefreshToken', () => {
		it('should verify a refresh token correctly', async () => {
			const token = 'mock-token'
			const userId = userMock.id

			const refreshToken = {
				user: userMock,
				token: 'mock-token'
			} as RefreshToken

			jest
				.spyOn(refreshTokenRepository, 'findOne')
				.mockResolvedValue(refreshToken)

			jest.spyOn(hashingService, 'verify').mockResolvedValue(true)

			const result = await service.verifyRefreshToken(token, userId)

			expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
				where: {
					user: { id: userId },
					isRevoked: false,
					expiresAt: MoreThan(expect.any(Date))
				},
				select: {
					user: true
				},
				relations: {
					user: true
				}
			})

			expect(hashingService.verify).toHaveBeenCalledWith(
				token,
				refreshToken.token
			)
			expect(result).toBe(userMock)
		})

		it('should throw an error if the refresh token is not found', async () => {
			const token = 'mock-token'
			const userId = userMock.id

			jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue(null)

			await expect(service.verifyRefreshToken(token, userId)).rejects.toThrow(
				UnauthorizedException
			)

			expect(refreshTokenRepository.findOne).toHaveBeenCalled()
		})

		it('should throw an error if the refresh token does not match', async () => {
			const token = 'mock-token'
			const userId = userMock.id

			jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue({
				user: userMock,
				token: 'mock-token'
			} as RefreshToken)

			jest.spyOn(hashingService, 'verify').mockResolvedValue(false)

			await expect(service.verifyRefreshToken(token, userId)).rejects.toThrow(
				UnauthorizedException
			)
		})

		it('should throw an error if the refresh token is not hashed', async () => {
			const token = 'mock-token'
			const userId = userMock.id

			jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue({
				user: userMock,
				token: 'mock-token'
			} as RefreshToken)

			jest.spyOn(hashingService, 'verify').mockImplementation(() => {
				throw new Error('Invalid refresh token')
			})

			await expect(service.verifyRefreshToken(token, userId)).rejects.toThrow(
				BadRequestException
			)
		})

		it('should throw an error if an error occurs while verifying the refresh token', async () => {
			const token = 'mock-token'
			const userId = userMock.id

			jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue({
				user: userMock,
				token: 'mock-token'
			} as RefreshToken)

			jest.spyOn(hashingService, 'verify').mockImplementation(() => {
				throw new Error('an error occurred while verifying the refresh token')
			})

			await expect(service.verifyRefreshToken(token, userId)).rejects.toThrow(
				InternalServerErrorException
			)
		})
	})

	describe('deleteUnusedRefreshTokens', () => {
		it('should delete unused refresh tokens correctly', async () => {
			await service.deleteUnusedRefreshTokens()

			expect(refreshTokenRepository.createQueryBuilder).toHaveBeenCalled()
			expect(
				refreshTokenRepository.createQueryBuilder().delete
			).toHaveBeenCalled()
			expect(
				refreshTokenRepository.createQueryBuilder().delete().from
			).toHaveBeenCalledWith(RefreshToken)
			expect(
				refreshTokenRepository.createQueryBuilder().delete().from(RefreshToken)
					.where
			).toHaveBeenCalledWith('expires_at < :now', { now: expect.any(Date) })
			expect(
				refreshTokenRepository
					.createQueryBuilder()
					.delete()
					.from(RefreshToken)
					.where('expires_at < :now', { now: expect.any(Date) }).orWhere
			).toHaveBeenCalledWith('is_revoked = true')
			expect(
				refreshTokenRepository
					.createQueryBuilder()
					.delete()
					.from(RefreshToken)
					.where('expires_at < :now', { now: expect.any(Date) })
					.orWhere('is_revoked = true').execute
			).toHaveBeenCalled()
		})

		it('should throw an error if an error occurs while deleting unused refresh tokens', async () => {
			jest
				.spyOn(
					refreshTokenRepository
						.createQueryBuilder()
						.delete()
						.from(RefreshToken)
						.where('expires_at < :now', { now: expect.any(Date) })
						.orWhere('is_revoked = true'),
					'execute'
				)
				.mockRejectedValue(
					new Error('an error occurred while deleting unused refresh tokens')
				)

			await expect(service.deleteUnusedRefreshTokens()).rejects.toThrow(
				InternalServerErrorException
			)
		})
	})
})
