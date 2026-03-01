import {
	BadRequestException,
	ConflictException,
	NotFoundException
} from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UserRole } from 'src/common/constants'
import { HashingService } from 'src/common/hashing/hashing.service'
import { Episode } from 'src/episodes/episode.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'
import {
	HashingServiceMock,
	UserRepositoryMock,
	userMock,
	watchTimesMock
} from './users.service.mock'

describe('UsersService', () => {
	let service: UsersService
	let repository: Repository<User>
	let hashingService: HashingService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, UserRepositoryMock, HashingServiceMock]
		}).compile()

		service = module.get<UsersService>(UsersService)
		repository = module.get<Repository<User>>(getRepositoryToken(User))
		hashingService = module.get<HashingService>(HashingService)

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
				role: UserRole.USER,
				password: userMock.password
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

		it('should hash the password correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567890'
			})

			const result = await service.create(dto)

			expect(hashingService.hash).toHaveBeenCalledWith(dto.password)
			expect(result.password).not.toEqual(dto.password)
			expect(result.password).toEqual(userMock.password)
		})
	})

	describe('getKeepWatchingList', () => {
		it('should throw an error if the user is not found', async () => {
			jest.spyOn(repository, 'findOne').mockResolvedValue(null)

			await expect(service.getKeepWatchingList(1)).rejects.toThrow(
				NotFoundException
			)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
				relations: {
					watchTimes: {
						episode: {
							course: true,
							watchTimes: true
						}
					}
				}
			})
		})

		it('should return the keep watching list correctly', async () => {
			jest.spyOn(repository, 'findOne').mockResolvedValue({
				...userMock,
				watchTimes: watchTimesMock
			} as User)

			const result = await service.getKeepWatchingList(userMock.id)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id: userMock.id },
				relations: {
					watchTimes: {
						episode: {
							course: true,
							watchTimes: true
						}
					}
				}
			})

			expect(result).toBeInstanceOf(Array<Episode>)
			expect(result[0]).toEqual(watchTimesMock[0].episode)
		})
	})

	describe('update', () => {
		it('should throw an error if the user is not found', async () => {
			jest.spyOn(repository, 'findOne').mockResolvedValue(null)

			await expect(service.update(1, { firstName: 'Updated' })).rejects.toThrow(
				NotFoundException
			)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id: 1 }
			})
		})

		it('should throw an error if the new email already exists', async () => {
			const existingUser = { ...userMock, id: 2 } as User

			jest.spyOn(repository, 'findOne').mockResolvedValue(userMock)
			jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser)

			await expect(
				service.update(1, { email: existingUser.email })
			).rejects.toThrow(ConflictException)

			expect(service.findByEmail).toHaveBeenCalledWith(existingUser.email)
		})

		it('should update the user correctly', async () => {
			const updatedUser = { ...userMock, firstName: 'Updated' } as User

			jest.spyOn(repository, 'findOne').mockResolvedValue(userMock)
			jest.spyOn(repository, 'create').mockReturnValue(updatedUser)
			jest.spyOn(repository, 'save').mockResolvedValue(updatedUser)

			const result = await service.update(userMock.id, {
				firstName: 'Updated'
			})

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id: userMock.id }
			})
			expect(repository.create).toHaveBeenCalledWith({
				...userMock,
				firstName: 'Updated'
			})
			expect(repository.save).toHaveBeenCalledWith(updatedUser)
			expect(result).toEqual(updatedUser)
		})
	})
})
