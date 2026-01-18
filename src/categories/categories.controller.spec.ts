import { Test, TestingModule } from '@nestjs/testing'
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
			const result = await controller.findAll({ limit: 10, offset: 0 })

			expect(result.data.length).toBeGreaterThan(0)
			expect(result.total).toBeDefined()
			expect(result.data).toEqual(expect.any(Array))
			expect(result.page).toBeDefined()
			expect(result.perPage).toBeDefined()
		})
	})
})
