import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import { userMock } from 'src/users/users.service.mock'
import { CreateFavoriteDto } from './dtos/create-favorite.dto'
import { Favorite } from './favorite.entity'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'

describe('FavoritesController', () => {
	let controller: FavoritesController
	let service: FavoritesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FavoritesController],
			providers: [
				{
					provide: FavoritesService,
					useValue: {
						create: jest.fn()
					}
				}
			]
		}).compile()

		controller = module.get<FavoritesController>(FavoritesController)
		service = module.get<FavoritesService>(FavoritesService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('create', () => {
		it('should create a favorite', async () => {
			const createFavoriteDto = plainToInstance(CreateFavoriteDto, {
				courseId: 1
			})

			const favoriteMock = {
				userId: userMock.id,
				courseId: createFavoriteDto.courseId,
				createdAt: new Date()
			} as unknown as Favorite

			jest.spyOn(service, 'create').mockResolvedValue(favoriteMock)

			const result = await controller.create(createFavoriteDto, userMock)

			expect(service.create).toHaveBeenCalledWith(
				userMock.id,
				createFavoriteDto.courseId
			)

			expect(result).toEqual(favoriteMock)
		})
	})
})
