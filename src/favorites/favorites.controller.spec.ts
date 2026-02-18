import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionsDto
} from 'src/common/pagination'
import { courseMock } from 'src/courses/courses.service.mock'
import { userMock } from 'src/users/users.service.mock'
import { CreateFavoriteDto } from './dtos/create-favorite.dto'
import { DeleteFavoriteDto } from './dtos/delete-favorite.dto'
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
						create: jest.fn(),
						findByUserId: jest.fn(),
						delete: jest.fn()
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

	describe('findByUserId', () => {
		it('should return a pagination of favorites courses by user id', async () => {
			const paginationOptionsDto = new PaginationOptionsDto()

			const paginationMeta = new PaginationMetaDto({
				itemCount: 1,
				options: paginationOptionsDto
			})

			const paginationDto = new PaginationDto([courseMock], paginationMeta)

			jest.spyOn(service, 'findByUserId').mockResolvedValue(paginationDto)

			const result = await controller.findByUserId(
				paginationOptionsDto,
				userMock
			)

			expect(service.findByUserId).toHaveBeenCalledWith(
				userMock.id,
				paginationOptionsDto
			)
			expect(result).toEqual(paginationDto)
		})
	})

	describe('delete', () => {
		it('should delete a favorite and return void', async () => {
			const deleteFavoriteDto = plainToInstance(DeleteFavoriteDto, {
				courseId: 1
			})

			const result = await controller.delete(deleteFavoriteDto, userMock)

			expect(service.delete).toHaveBeenCalledWith(
				userMock.id,
				deleteFavoriteDto.courseId
			)
			expect(result).toBeUndefined()
		})
	})
})
