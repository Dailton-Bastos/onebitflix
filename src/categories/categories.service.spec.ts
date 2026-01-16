import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriesService } from './categories.service'
import { CategoryRespositoryMock } from './categories.service.mock'
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

			expect(repository.find).toHaveBeenCalledTimes(1)
			expect(result).toBeDefined()
			expect(result).toEqual(expect.any(Array))
		})

		it('should return an array of categories ordered by position', async () => {
			const result = await service.findAll()

			expect(repository.find).toHaveBeenCalledWith({
				order: { position: 'ASC' }
			})
			expect(result).toEqual(expect.any(Array))
		})
	})
})
