import { HttpStatus } from '@nestjs/common'
import request from 'supertest'

import { app } from './setup'

describe('Categories (e2e)', () => {
	describe('GET /api/categories', () => {
		it('should return an array of categories', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/categories')
				.expect(HttpStatus.OK)
			expect(response.body).toBeInstanceOf(Array)
		})
	})

	afterAll(async () => {
		await app.close()
	})
})
