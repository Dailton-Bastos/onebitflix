import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import { userMock } from 'src/users/users.service.mock'
import { CreateLikeDto } from './dtos/create-like.dto'
import { DeleteLikeDto } from './dtos/delete-like.dto'
import { Like } from './like.entity'
import { LikesController } from './likes.controller'
import { LikesService } from './likes.service'

describe('LikesController', () => {
	let controller: LikesController
	let service: LikesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LikesController],
			providers: [
				{
					provide: LikesService,
					useValue: {
						create: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		}).compile()

		controller = module.get<LikesController>(LikesController)
		service = module.get<LikesService>(LikesService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('create', () => {
		it('should create a like', async () => {
			const createLikeDto = plainToInstance(CreateLikeDto, {
				courseId: 1
			})

			const likeMock = {
				userId: userMock.id,
				courseId: createLikeDto.courseId,
				createdAt: new Date()
			} as unknown as Like

			jest.spyOn(service, 'create').mockResolvedValue(likeMock)

			const result = await controller.create(createLikeDto, userMock)

			expect(service.create).toHaveBeenCalledWith(
				userMock.id,
				createLikeDto.courseId
			)

			expect(result).toEqual(likeMock)
		})
	})

	describe('delete', () => {
		it('should delete a like and return void', async () => {
			const deleteLikeDto = plainToInstance(DeleteLikeDto, {
				courseId: 1
			})

			const result = await controller.delete(deleteLikeDto, userMock)

			expect(service.delete).toHaveBeenCalledWith(
				userMock.id,
				deleteLikeDto.courseId
			)
			expect(result).toBeUndefined()
		})
	})
})
