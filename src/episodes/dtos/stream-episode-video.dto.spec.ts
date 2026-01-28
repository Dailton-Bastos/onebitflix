import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { StreamEpisodeVideoDto } from './stream-episode-video.dto'

describe('StreamEpisodeVideoDto', () => {
	it('should be defined', () => {
		const dto = plainToInstance(StreamEpisodeVideoDto, {
			videoUrl: '/videos/course-1/episode-1.mp4'
		})

		expect(dto).toBeDefined()
	})

	it('should fails validation if videoUrl is not a string', async () => {
		const dto = plainToInstance(StreamEpisodeVideoDto, {
			videoUrl: 123
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('videoUrl')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isString).toBeTruthy()
	})

	it('should fails validation if videoUrl is empty', async () => {
		const dto = plainToInstance(StreamEpisodeVideoDto, {
			videoUrl: ''
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('videoUrl')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
	})

	it('should pass validation if videoUrl is a valid string', async () => {
		const dto = plainToInstance(StreamEpisodeVideoDto, {
			videoUrl: '/videos/course-1/episode-1.mp4'
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(0)
	})
})
