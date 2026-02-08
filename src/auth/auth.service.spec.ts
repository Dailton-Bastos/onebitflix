import {
	BadRequestException,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { HashingService } from 'src/common/hashing/hashing.service'
import { TokenPayload } from 'src/common/interfaces'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import {
	HashingServiceMock,
	UserRepositoryMock,
	UsersServiceMock,
	userMock
} from 'src/users/users.service.mock'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { JwtServiceMock } from './auth.service.mock'

describe('AuthService', () => {
	let service: AuthService
	let usersService: UsersService
	let userRepository: Repository<User>
	let hashingService: HashingService
	let jwtService: JwtService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersServiceMock,
				UserRepositoryMock,
				HashingServiceMock,
				JwtServiceMock
			]
		}).compile()

		service = module.get<AuthService>(AuthService)
		usersService = module.get<UsersService>(UsersService)
		userRepository = module.get<Repository<User>>(getRepositoryToken(User))
		hashingService = module.get<HashingService>(HashingService)
		jwtService = module.get<JwtService>(JwtService)

		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(usersService).toBeDefined()
		expect(userRepository).toBeDefined()
		expect(hashingService).toBeDefined()
		expect(jwtService).toBeDefined()
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
		it('should login a user correctly', async () => {
			const payload: TokenPayload = {
				sub: userMock.id,
				email: userMock.email
			}

			const result = await service.login(userMock)

			expect(jwtService.sign).toHaveBeenCalledWith(payload)

			expect(result).toEqual({
				access_token: expect.any(String)
			})
		})
	})
})
