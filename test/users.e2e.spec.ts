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

	describe('GET /api/users/current', () => {
		it('should return the current user', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/users/current')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(response.body.email).toBe('test@test.com')
		})
	})

	describe('PATCH /api/users/current', () => {
		it('should update and return the current user', async () => {
			const response = await request(app.getHttpServer())
				.patch('/api/users/current')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ firstName: 'Updated' })
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(response.body.firstName).toBe('Updated')
		})

		it('should return 401 if the token is invalid', async () => {
			// Simulate user not found by using an invalid access token
			const invalidAccessToken = 'invalid-token'

			await request(app.getHttpServer())
				.patch('/api/users/current')
				.set('Authorization', `Bearer ${invalidAccessToken}`)
				.send({ firstName: 'Updated' })
				.expect(HttpStatus.UNAUTHORIZED)
		})

		it('should return 409 if email already exists', async () => {
			// Create another user to cause email conflict
			const createUserDto = plainToInstance(CreateUserDto, {
				firstName: 'Another',
				lastName: 'User',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'another@test.com',
				password: '1234567890'
			})

			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(createUserDto)
				.expect(HttpStatus.CREATED)

			await request(app.getHttpServer())
				.patch('/api/users/current')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ email: createUserDto.email })
				.expect(HttpStatus.CONFLICT)
		})
	})

	describe('PATCH /api/users/current/password', () => {
		it('should update the current user password', async () => {
			await request(app.getHttpServer())
				.patch('/api/users/current/password')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ newPassword: 'newpassword123', currentPassword: '1234567890' })
				.expect(HttpStatus.NO_CONTENT)

			// Try to login with the new password
			await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({ email: 'test@test.com', password: 'newpassword123' })
				.expect(HttpStatus.OK)
		})

		it('should return 400 if current password is incorrect', async () => {
			await request(app.getHttpServer())
				.patch('/api/users/current/password')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					newPassword: 'newpassword123',
					currentPassword: 'wrongpassword'
				})
				.expect(HttpStatus.BAD_REQUEST)
		})

		it('should return 401 if the token is invalid', async () => {
			// Simulate user not found by using an invalid access token
			const invalidAccessToken = 'invalid-token'

			await request(app.getHttpServer())
				.patch('/api/users/current/password')
				.set('Authorization', `Bearer ${invalidAccessToken}`)
				.send({ newPassword: 'newpassword123', currentPassword: '1234567890' })
				.expect(HttpStatus.UNAUTHORIZED)
		})
	})
})
