import { Test, TestingModule } from '@nestjs/testing'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UsersServiceMock, userMock } from './users.service.mock'

describe('UsersController', () => {
	let controller: UsersController
	let service: UsersService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersServiceMock]
		}).compile()

		controller = module.get<UsersController>(UsersController)
		service = module.get<UsersService>(UsersService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('getKeepWatchingList', () => {
		it('should return an array of episodes', async () => {
			jest
				.spyOn(service, 'getKeepWatchingList')
				.mockResolvedValueOnce([episodeMock])

			const result = await controller.getKeepWatchingList(userMock)

			expect(service.getKeepWatchingList).toHaveBeenCalledWith(userMock.id)

			expect(result).toBeDefined()
			expect(result).toEqual([episodeMock])
		})
	})
})
