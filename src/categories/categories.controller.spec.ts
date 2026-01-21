import { Test, TestingModule } from '@nestjs/testing'
import { PaginationOptionsDto } from 'src/common/pagination'
import { courseMock } from 'src/courses/courses.service.mock'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { CategoriesServiceMock, categoryMock } from './categories.service.mock'

describe('CategoriesController', () => {
	let controller: CategoriesController
	let service: CategoriesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [CategoriesServiceMock]
		}).compile()

		controller = module.get<CategoriesController>(CategoriesController)
		service = module.get<CategoriesService>(CategoriesService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('findAll', () => {
		it('should return an array of categories', async () => {
			const result = await controller.findAll()

			expect(result.data.length).toBeGreaterThan(0)
			expect(result.data).toEqual([categoryMock])
		})

		it('should return an array of categories with pagination', async () => {
			const paginationOptionsDto = new PaginationOptionsDto()

			const result = await controller.findAll(paginationOptionsDto)

			expect(result.data.length).toBeGreaterThan(0)
			expect(result.meta).toBeDefined()
			expect(result.meta.page).toBeDefined()
			expect(result.meta.take).toBeDefined()
			expect(result.meta.itemCount).toBeDefined()
			expect(result.meta.pageCount).toBeDefined()
			expect(result.meta.hasPreviousPage).toBeDefined()
			expect(result.meta.hasNextPage).toBeDefined()
			expect(result.data).toEqual([categoryMock])
		})
	})

	describe('findByIdWithCourses', () => {
		it('should return a category with courses', async () => {
			const result = await controller.findByIdWithCourses(categoryMock.id)

			expect(service.findByIdWithCourses).toHaveBeenCalledWith(categoryMock.id)

			expect(result).toBeDefined()
			expect(result.id).toBe(categoryMock.id)
			expect(result.courses).toBeDefined()
			expect(result.courses).toEqual([courseMock])
		})

		it('should return a existing category without createdAt and updatedAt properties', async () => {
			const result = await controller.findByIdWithCourses(categoryMock.id)

			expect(result).toBeDefined()
			expect(result.id).toBe(categoryMock.id)
			expect(result.name).toBe(categoryMock.name)
			expect(result.position).toBe(categoryMock.position)
			expect(result.courses).toBeDefined()
			expect(result.courses).toEqual([courseMock])
			expect(result.createdAt).toBeUndefined()
			expect(result.updatedAt).toBeUndefined()
		})
	})
})
