import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionsDto
} from 'src/common/pagination'
import { CoursesService } from 'src/courses/courses.service'
import {
	CoursesServiceMock,
	courseMock
} from 'src/courses/courses.service.mock'
import { Repository } from 'typeorm'
import { Favorite } from './favorite.entity'
import { FavoritesService } from './favorites.service'

describe('FavoritesService', () => {
	let service: FavoritesService
	let coursesService: CoursesService
	let favoriteRepository: Repository<Favorite>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FavoritesService,
				CoursesServiceMock,
				{
					provide: getRepositoryToken(Favorite),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						findAndCount: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		}).compile()

		service = module.get<FavoritesService>(FavoritesService)
		coursesService = module.get<CoursesService>(CoursesService)
		favoriteRepository = module.get<Repository<Favorite>>(
			getRepositoryToken(Favorite)
		)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(coursesService).toBeDefined()
		expect(favoriteRepository).toBeDefined()
	})

	describe('create', () => {
		it('should create a favorite', async () => {
			const userId = 1
			const courseId = 1

			const favoriteMock = {
				userId,
				courseId,
				createdAt: new Date()
			} as unknown as Favorite

			jest.spyOn(favoriteRepository, 'create').mockReturnValue(favoriteMock)
			jest.spyOn(favoriteRepository, 'save').mockResolvedValue(favoriteMock)

			const result = await service.create(userId, courseId)

			expect(coursesService.findById).toHaveBeenCalledWith(courseId)
			expect(favoriteRepository.create).toHaveBeenCalledWith({
				userId,
				courseId
			})
			expect(favoriteRepository.save).toHaveBeenCalledTimes(1)
			expect(favoriteRepository.save).toHaveBeenCalledWith({
				userId,
				courseId,
				createdAt: expect.any(Date)
			})

			expect(result).toEqual(favoriteMock)
		})

		it('should throw an error if the course is not found', async () => {
			const userId = 1
			const courseId = 999

			jest.spyOn(coursesService, 'findById').mockResolvedValue(null)

			await expect(service.create(userId, courseId)).rejects.toThrow(
				NotFoundException
			)

			expect(coursesService.findById).toHaveBeenCalledWith(courseId)
			expect(favoriteRepository.create).not.toHaveBeenCalled()
			expect(favoriteRepository.save).not.toHaveBeenCalled()
		})
	})

	describe('findByUserId', () => {
		it('should return a pagination of favorites courses by user id', async () => {
			const userId = 1
			const courseId = 1

			const paginationOptionsDto = new PaginationOptionsDto()

			const paginationMeta = new PaginationMetaDto({
				itemCount: 1,
				options: paginationOptionsDto
			})

			const favoriteMock = {
				userId,
				courseId,
				createdAt: new Date(),
				course: courseMock
			} as Favorite

			const paginationDto = new PaginationDto([courseMock], paginationMeta)

			jest
				.spyOn(favoriteRepository, 'findAndCount')
				.mockResolvedValue([[favoriteMock], 1])

			const result = await service.findByUserId(userId, paginationOptionsDto)

			expect(favoriteRepository.findAndCount).toHaveBeenCalledWith({
				where: { userId },
				relations: { course: true },
				order: { createdAt: paginationOptionsDto.order },
				take: paginationOptionsDto.take,
				skip: paginationOptionsDto.skip
			})

			expect(result.data).toEqual([courseMock])
			expect(result.meta).toEqual(paginationDto.meta)
			expect(result).toEqual(paginationDto)
		})
	})

	describe('delete', () => {
		it('should delete a favorite and return void', async () => {
			const userId = 1
			const courseId = 1

			jest
				.spyOn(favoriteRepository, 'delete')
				.mockResolvedValue({ affected: 1, raw: [] })

			await service.delete(userId, courseId)

			expect(favoriteRepository.delete).toHaveBeenCalledWith({
				userId,
				courseId
			})
		})

		it('should throw an error if the favorite is not found', async () => {
			const userId = 1
			const courseId = 1

			jest
				.spyOn(favoriteRepository, 'delete')
				.mockResolvedValue({ affected: 0, raw: [] })

			await expect(service.delete(userId, courseId)).rejects.toThrow(
				NotFoundException
			)

			expect(favoriteRepository.delete).toHaveBeenCalledWith({
				userId,
				courseId
			})
		})
	})
})
