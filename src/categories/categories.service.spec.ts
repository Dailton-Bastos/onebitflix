import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Order } from 'src/common/constants'
import { PaginationOptionsDto } from 'src/common/pagination'
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
})
