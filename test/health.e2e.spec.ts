import { HttpStatus } from '@nestjs/common'
import request from 'supertest'
import { app } from './setup'

describe('HealthE2E', () => {
	describe('GET /api/health', () => {
		it('should return status ok and timestamp', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/health')
				.expect(HttpStatus.OK)

			expect(response.body.status).toBe('ok')
			expect(new Date(response.body.timestamp)).toBeInstanceOf(Date)
		})
	})
})
