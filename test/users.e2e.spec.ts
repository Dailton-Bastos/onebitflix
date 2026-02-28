import { HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import request from 'supertest'
import { app } from './setup'

describe('Users (e2e)', () => {
	let accessToken: string

	beforeEach(async () => {
		const createUserDto = plainToInstance(CreateUserDto, {
			firstName: 'Test',
			lastName: 'Teste',
			phone: '123456789012345',
			birth: '1990-01-01',
			email: 'test@test.com',
			password: '1234567890'
		})

		await request(app.getHttpServer())
			.post('/api/auth/register')
			.send(createUserDto)
			.expect(HttpStatus.CREATED)

		const loginResponse = await request(app.getHttpServer())
			.post('/api/auth/login')
			.send({ email: createUserDto.email, password: createUserDto.password })
			.expect(HttpStatus.OK)

		accessToken = loginResponse.body.access_token
	})

	describe('GET /api/users/current/watching', () => {
		it('should return the keep watching list', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/users/current/watching')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(Array.isArray(response.body)).toBe(true)
		})
	})
})
