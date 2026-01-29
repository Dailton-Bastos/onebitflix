import { HttpStatus } from '@nestjs/common'
import { StreamEpisodeVideoDto } from 'src/episodes/dtos'
import request from 'supertest'
import { app } from './setup'

describe('Episodes (e2e)', () => {
	describe('GET /api/episodes/stream', () => {
		it('should throw an error if the videoUrl is empty', async () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: ''
			}

			const response = await request(app.getHttpServer())
				.get('/api/episodes/stream')
				.query(streamEpisodeVideoDto)
				.expect(HttpStatus.BAD_REQUEST)

			expect(response.body.message).toContain('videoUrl should not be empty')
		})

		it('should throw an error if the videoUrl is not found', async () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: 'INVALID_VIDEO_URL.mp4'
			}

			const response = await request(app.getHttpServer())
				.get('/api/episodes/stream')
				.query(streamEpisodeVideoDto)

			expect(response.body).toEqual({
				statusCode: HttpStatus.NOT_FOUND,
				error: 'Not Found',
				message: 'video not found'
			})
		})

		it('should create a video stream', async () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: 'videos/course-3/Screen Recording 2026-01-13 at 15.28.49.mp4'
			}

			const response = await request(app.getHttpServer())
				.get('/api/episodes/stream')
				.query(streamEpisodeVideoDto)

			expect(response.status).toBe(HttpStatus.OK)
			expect(response.header['content-type']).toBe('video/mp4')
			expect(response.header['content-length']).toEqual(expect.any(String))
		})
	})
})
