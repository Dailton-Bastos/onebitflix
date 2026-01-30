import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
})
