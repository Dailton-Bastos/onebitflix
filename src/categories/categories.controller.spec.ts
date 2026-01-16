import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesController } from './categories.controller'
import { categoriesServiceMock, categoryMock } from './categories.service.mock'

describe('CategoriesController', () => {
	let controller: CategoriesController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoriesController],
			providers: [categoriesServiceMock]
		}).compile()

		controller = module.get<CategoriesController>(CategoriesController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('findAll', () => {
		it('should return an array of categories', async () => {
			const result = await controller.findAll()

			expect(result.length).toBeGreaterThan(0)
			expect(result).toEqual([categoryMock])
		})
	})
})
