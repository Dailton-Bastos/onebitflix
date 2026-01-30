import { BadRequestException, ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UserRole } from 'src/common/constants'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { UserRepositoryMock, userMock } from './users.service.mock'

describe('UsersService', () => {
	let service: UsersService
	let repository: Repository<User>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, UserRepositoryMock]
		}).compile()

		service = module.get<UsersService>(UsersService)
		repository = module.get<Repository<User>>(getRepositoryToken(User))

		jest.restoreAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(repository).toBeDefined()
	})

	describe('findByEmail', () => {
		it('should return a user by email', async () => {
			const result = await service.findByEmail(userMock.email)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { email: userMock.email }
			})

			expect(result).toEqual(userMock)
		})

		it('should return null if the user is not found', async () => {
			jest.spyOn(repository, 'findOne').mockResolvedValue(null)

			const result = await service.findByEmail(userMock.email)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { email: userMock.email }
			})

			expect(result).toBeNull()
		})

		it('should throw an error if the email is not provided', async () => {
			await expect(service.findByEmail('')).rejects.toThrow(BadRequestException)
		})
	})

	describe('create', () => {
		it('should create a new user correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567890'
			})
			const result = await service.create(dto)

			expect(repository.create).toHaveBeenCalledWith({
				...dto,
				role: UserRole.USER
			})
			expect(repository.save).toHaveBeenCalled()

			expect(result).toEqual(userMock)
		})

		it('should throw an error if the email already exists', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567890'
			})

			jest.spyOn(service, 'findByEmail').mockResolvedValue(userMock)

			await expect(service.create(dto)).rejects.toThrow(ConflictException)

			expect(service.findByEmail).toHaveBeenCalledWith(dto.email)
		})
	})
})
