import { HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { jwtConstants } from 'src/common/constants'
import { CreateUserDto } from 'src/users/dtos'
import request from 'supertest'
import { app } from './setup'

describe('Auth (e2e)', () => {
	describe('POST /api/auth/register', () => {
		it('should register a new user correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			const response = await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			expect(response.body.id).toBeDefined()
			expect(response.body.firstName).toBe(dto.firstName)
			expect(response.body.lastName).toBe(dto.lastName)
			expect(response.body.phone).toBe(dto.phone)
			expect(response.body.birth).toBe(dto.birth.toISOString())
			expect(response.body.email).toBe(dto.email)
		})

		it('should return a validation error if the dto is invalid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: 'invalid date',
				email: 'test@test.com',
				password: '1234567890'
			})

			const response = await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.BAD_REQUEST)

			expect(response.body.message).toBeDefined()
		})

		it('should return a validation error if the email is already in use', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CONFLICT)

			expect(response.body.message).toBeDefined()
			expect(response.body.message).toContain('email already exists')
		})

		it('should return a new user without password in the response', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			const response = await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			expect(response.body.password).toBeUndefined()
		})
	})

	describe('POST /api/auth/login', () => {
		const dto = plainToInstance(CreateUserDto, {
			firstName: 'Test',
			lastName: 'Teste',
			phone: '123456789012345',
			birth: '1990-01-01',
			email: 'test@test.com',
			password: '1234567890'
		})

		it('should login a user correctly', async () => {
			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: dto.email,
					password: dto.password
				})
				.expect(HttpStatus.OK)

			expect(response.body.access_token).toBeDefined()
			expect(response.body.refresh_token).toBeDefined()
		})

		it('should return a unauthorized error if the user password is incorrect', async () => {
			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: dto.email,
					password: 'incorrect password'
				})
				.expect(HttpStatus.UNAUTHORIZED)

			expect(response.body.message).toBeDefined()
			expect(response.body.message).toContain('invalid credentials')
		})

		it('should return a unauthorized error if the user not exists', async () => {
			const response = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: 'incorrect@test.com',
					password: '1234567890'
				})
				.expect(HttpStatus.UNAUTHORIZED)

			expect(response.body.message).toBeDefined()
			expect(response.body.message).toContain('Unauthorized')
		})

		it('should set the access token in a cookie', async () => {
			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: dto.email,
					password: dto.password
				})
				.expect(HttpStatus.OK)

			expect(response.headers['set-cookie']).toBeDefined()
			expect(response.headers['set-cookie'][0]).toContain(
				jwtConstants.accessTokenName
			)
			expect(response.headers['set-cookie'][0]).toContain('HttpOnly')
		})

		it('should set the refresh token in a cookie', async () => {
			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: dto.email,
					password: dto.password
				})
				.expect(HttpStatus.OK)

			expect(response.headers['set-cookie']).toBeDefined()
			expect(response.headers['set-cookie'][1]).toContain(
				jwtConstants.refreshTokenName
			)
			expect(response.headers['set-cookie'][1]).toContain('HttpOnly')
		})
	})

	describe('POST /api/auth/logout', () => {
		it('should logout a user correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			await request(app.getHttpServer())
				.post('/api/auth/register')
				.send(dto)
				.expect(HttpStatus.CREATED)

			const loginResponse = await request(app.getHttpServer())
				.post('/api/auth/login')
				.send({
					email: dto.email,
					password: dto.password
				})
				.expect(HttpStatus.OK)

			const logoutResponse = await request(app.getHttpServer())
				.post('/api/auth/logout')
				.set('Authorization', `Bearer ${loginResponse.body.access_token}`)
				.expect(HttpStatus.OK)

			expect(logoutResponse.headers['set-cookie'][0]).toContain(
				'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
			)
			expect(logoutResponse.headers['set-cookie'][1]).toContain(
				'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
			)
		})
	})
})
