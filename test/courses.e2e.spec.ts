import { HttpStatus } from '@nestjs/common'
import request from 'supertest'
import { app } from './setup'

describe('Courses (e2e)', () => {
	describe('GET /api/courses/:id', () => {
		it('should throw an error if the course is not found', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/courses/1')
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBe('course not found')
		})
	})
})
