import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
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
				order: { position: 'ASC' },
				take: 10,
				skip: 0
			})
			expect(result.data).toEqual([categoryMock])
		})

		it('should return an array of categories with pagination', async () => {
			const limit = 10
			const offset = 0
			const total = 1

			const paginationDto: PaginationDto = {
				limit,
				offset
			}
			const result = await service.findAll(paginationDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: 'ASC' },
				take: limit,
				skip: offset
			})
			expect(result.data).toEqual([categoryMock])
			expect(result.total).toBe(total)
			expect(result.page).toBe(1)
			expect(result.perPage).toBe(10)
			expect(result.nextPage).toBe(null)
			expect(result.previousPage).toBe(null)
		})

		it('should return an array of categories with pagination and next page', async () => {
			const limit = 10
			const offset = 0
			const total = 16

			const paginationDto: PaginationDto = {
				limit,
				offset
			}
			repository.findAndCount = jest
				.fn()
				.mockResolvedValue([[categoryMock], total])

			const result = await service.findAll(paginationDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: 'ASC' },
				take: limit,
				skip: offset
			})

			expect(result.data).toEqual([categoryMock])
			expect(result.total).toBe(total)
			expect(result.page).toBe(1)
			expect(result.perPage).toBe(10)
			expect(result.nextPage).toBeGreaterThan(1)
			expect(result.previousPage).toBe(null)
		})

		it('should return an array of categories with pagination and previous page', async () => {
			const limit = 10
			const offset = 11
			const total = 16

			const paginationDto: PaginationDto = {
				limit,
				offset
			}
			repository.findAndCount = jest
				.fn()
				.mockResolvedValue([[categoryMock], total])

			const result = await service.findAll(paginationDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: 'ASC' },
				take: limit,
				skip: offset
			})

			expect(result.data).toEqual([categoryMock])
			expect(result.total).toBe(total)
			expect(result.page).toBeGreaterThan(1)
			expect(result.perPage).toBe(10)
			expect(result.nextPage).toBe(null)
			expect(result.previousPage).toBeGreaterThan(0)
		})

		it('should return an array of categories with pagination and next page and previous page', async () => {
			const limit = 3
			const offset = 6
			const total = 16

			const paginationDto: PaginationDto = {
				limit,
				offset
			}
			repository.findAndCount = jest
				.fn()
				.mockResolvedValue([[categoryMock], total])

			const result = await service.findAll(paginationDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				order: { position: 'ASC' },
				take: limit,
				skip: offset
			})

			expect(result.nextPage).toBe(4)
			expect(result.previousPage).toBe(2)
			expect(result.page).toBe(3)
		})

		it('should return an array of categories with pagination and next page and previous  are null', async () => {
			const limit = 16
			const offset = 0
			const total = 16

			const paginationDto: PaginationDto = {
				limit,
				offset
			}
			repository.findAndCount = jest.fn().mockResolvedValue([[], total])

			const result = await service.findAll(paginationDto)

			expect(result.nextPage).toBe(null)
			expect(result.previousPage).toBe(null)
		})
	})
})
