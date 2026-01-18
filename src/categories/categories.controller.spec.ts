import { Test, TestingModule } from '@nestjs/testing'
import { PaginationOptionsDto } from 'src/common/pagination'
import { CategoriesController } from './categories.controller'
import { CategoriesServiceMock, categoryMock } from './categories.service.mock'

describe('CategoriesController', () => {
	let controller: CategoriesController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [CategoriesServiceMock]
		}).compile()

		controller = module.get<CategoriesController>(CategoriesController)
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
})
