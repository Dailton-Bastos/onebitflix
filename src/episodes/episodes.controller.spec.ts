import { Test, TestingModule } from '@nestjs/testing'
import { StreamEpisodeVideoDto } from './dtos'
import { EpisodesController } from './episodes.controller'
import { EpisodesService } from './episodes.service'
import {
	EpisodesServiceMock,
	requestMock,
	responseMock
} from './episodes.service.mock'

describe('EpisodesController', () => {
	let controller: EpisodesController
	let service: EpisodesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EpisodesController],
			providers: [EpisodesServiceMock]
		}).compile()

		controller = module.get<EpisodesController>(EpisodesController)
		service = module.get<EpisodesService>(EpisodesService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('streamEpisodeVideo', () => {
		it('should create a stream of the episode video', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: '/videos/course-1/episode-1.mp4'
			}

			controller.streamEpisodeVideo(
				streamEpisodeVideoDto,
				requestMock,
				responseMock
			)

			expect(service.streamEpisodeVideo).toHaveBeenCalledWith(
				streamEpisodeVideoDto,
				requestMock,
				responseMock
			)

			expect(service.streamEpisodeVideo).toHaveBeenCalledTimes(1)
		})
	})
})
