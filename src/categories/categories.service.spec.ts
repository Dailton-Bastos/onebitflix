import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Order } from 'src/common/constants'
import { PaginationOptionsDto } from 'src/common/pagination'
import { courseMock } from 'src/courses/courses.service.mock'
import { Repository } from 'typeorm'
import { CategoriesService } from './categories.service'
import {
	CategoryRespositoryMock,
	categoryMock
} from './categories.service.mock'
import { Category } from './category.entity'

describe('CategoriesService', () => {
	let service: CategoriesService
	let repository: Repository<Category>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CategoriesService, CategoryRespositoryMock]
		}).compile()

		service = module.get<CategoriesService>(CategoriesService)
		repository = module.get<Repository<Category>>(getRepositoryToken(Category))

		jest.restoreAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('findAll', () => {
		it('should return an array of categories', async () => {
			const result = await service.findAll()

			expect(repository.findAndCount).toHaveBeenCalledTimes(1)
			expect(result.data).toBeDefined()
			expect(result.data).toEqual([categoryMock])
		})

		it('should return an array of categories ordered by position', async () => {
			const result = await service.findAll()

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: Order.ASC },
				take: 10,
				skip: 0
			})
			expect(result.data).toEqual([categoryMock])
		})

		it('should return an array of categories with pagination', async () => {
			const take = 10
			const itemCount = 1

			const paginationOptionsDto: PaginationOptionsDto = {
				page: 1,
				take,
				order: Order.ASC,
				skip: 0
			}

			const result = await service.findAll(paginationOptionsDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: paginationOptionsDto.order },
				take: paginationOptionsDto.take,
				skip: paginationOptionsDto.skip
			})
			expect(result.data).toEqual([categoryMock])
			expect(result.meta.itemCount).toBe(itemCount)
			expect(result.meta.page).toBe(paginationOptionsDto.page)
			expect(result.meta.take).toBe(paginationOptionsDto.take)
			expect(result.meta.hasPreviousPage).toBe(false)
			expect(result.meta.hasNextPage).toBe(false)
		})

		it('should return an array of categories with pagination and next page', async () => {
			const take = 10
			const itemCount = 16

			const paginationOptionsDto: PaginationOptionsDto = {
				page: 1,
				take,
				order: Order.ASC,
				skip: 0
			}

			jest
				.spyOn(repository, 'findAndCount')
				.mockResolvedValue([
					Array.from({ length: itemCount }, () => categoryMock),
					itemCount
				])

			const result = await service.findAll(paginationOptionsDto)

			expect(result.meta.itemCount).toBe(itemCount)
			expect(result.meta.page).toBe(paginationOptionsDto.page)
			expect(result.meta.take).toBe(paginationOptionsDto.take)
			expect(result.meta.hasPreviousPage).toBe(false)
			expect(result.meta.hasNextPage).toBe(true)
		})

		it('should return an array of categories with pagination and previous page', async () => {
			const take = 4
			const skip = 4
			const itemCount = 16

			const paginationOptionsDto: PaginationOptionsDto = {
				page: 4,
				take,
				order: Order.ASC,
				skip
			}

			jest
				.spyOn(repository, 'findAndCount')
				.mockResolvedValue([
					Array.from({ length: itemCount }, () => categoryMock),
					itemCount
				])

			const result = await service.findAll(paginationOptionsDto)

			expect(result.meta.itemCount).toBe(itemCount)
			expect(result.meta.page).toBe(paginationOptionsDto.page)
			expect(result.meta.take).toBe(paginationOptionsDto.take)
			expect(result.meta.hasPreviousPage).toBe(true)
			expect(result.meta.hasNextPage).toBe(false)
		})

		it('should return an array of categories with pagination and next page and previous page are true', async () => {
			const take = 3
			const skip = 6
			const itemCount = 16

			const paginationOptionsDto: PaginationOptionsDto = {
				page: 3,
				take,
				order: Order.ASC,
				skip
			}

			const result = await service.findAll(paginationOptionsDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: 'ASC' },
				take: paginationOptionsDto.take,
				skip: paginationOptionsDto.skip
			})

			expect(result.meta.itemCount).toBe(itemCount)
			expect(result.meta.page).toBe(paginationOptionsDto.page)
			expect(result.meta.take).toBe(paginationOptionsDto.take)
			expect(result.meta.hasPreviousPage).toBe(true)
			expect(result.meta.hasNextPage).toBe(true)
		})

		it('should return an array of categories with pagination and next page and previous page are false', async () => {
			const take = 16
			const itemCount = 16

			const paginationOptionsDto: PaginationOptionsDto = {
				page: 1,
				take,
				order: Order.ASC,
				skip: 0
			}

			const result = await service.findAll(paginationOptionsDto)

			expect(result.meta.itemCount).toBe(itemCount)
			expect(result.meta.page).toBe(paginationOptionsDto.page)
			expect(result.meta.take).toBe(paginationOptionsDto.take)
			expect(result.meta.hasPreviousPage).toBe(false)
			expect(result.meta.hasNextPage).toBe(false)
		})
	})

	describe('findByIdWithCourses', () => {
		it('should find a category with findOne repository method', async () => {
			const id = 1

			await service.findByIdWithCourses(id)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id },
				relations: {
					courses: true
				}
			})
		})

		it('should return a category with courses', async () => {
			const id = 1

			const result = await service.findByIdWithCourses(id)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id },
				relations: {
					courses: true
				}
			})

			expect(result).toBeDefined()
			expect(result.id).toBe(id)
			expect(result.courses).toBeDefined()
			expect(result.courses).toEqual([courseMock])
		})

		it('should return a category with empty courses array', async () => {
			const id = 1

			jest.spyOn(repository, 'findOne').mockResolvedValue({
				...categoryMock,
				courses: []
			} as unknown as Category)

			const result = await service.findByIdWithCourses(id)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id },
				relations: {
					courses: true
				}
			})

			expect(result).toBeDefined()
			expect(result.id).toBe(id)
			expect(result.courses).toBeDefined()
			expect(result.courses).toEqual([])
		})

		it('should throw an error if the category is not found', async () => {
			const id = 999

			jest.spyOn(repository, 'findOne').mockResolvedValue(null)

			await expect(service.findByIdWithCourses(id)).rejects.toThrow(
				NotFoundException
			)
		})
	})
})
