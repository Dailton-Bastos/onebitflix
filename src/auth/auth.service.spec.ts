import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import {
	UserRepositoryMock,
	UsersServiceMock,
	userMock
} from 'src/users/users.service.mock'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'

describe('AuthService', () => {
	let service: AuthService
	let usersService: UsersService
	let userRepository: Repository<User>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, UsersServiceMock, UserRepositoryMock]
		}).compile()

		service = module.get<AuthService>(AuthService)
		usersService = module.get<UsersService>(UsersService)
		userRepository = module.get<Repository<User>>(getRepositoryToken(User))

		jest.restoreAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(usersService).toBeDefined()
		expect(userRepository).toBeDefined()
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
})
