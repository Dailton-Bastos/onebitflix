import { HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CreateFavoriteDto } from 'src/favorites/dtos/create-favorite.dto'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import request from 'supertest'
import { app, categoryRepository, courseRepository } from './setup'

describe('Favorites (e2e)', () => {
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

		const categoryData = categoryRepository.create({
			name: 'test category',
			position: 1
		})

		const category = await categoryRepository.save(categoryData)

		const courseData = courseRepository.create({
			name: 'test course',
			synopsis: 'test synopsis',
			category
		})

		await courseRepository.save(courseData)
	})

	describe('POST /api/favorites', () => {
		it('should create a favorite', async () => {
			const createFavoriteDto = plainToInstance(CreateFavoriteDto, {
				courseId: 1
			})

			const response = await request(app.getHttpServer())
				.post('/api/favorites')
				.send(createFavoriteDto)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.CREATED)

			expect(response.body.userId).toBeDefined()
			expect(response.body.courseId).toBe(createFavoriteDto.courseId)
			expect(response.body.createdAt).toBeDefined()
		})

		it('should return a 404 error if the course is not found', async () => {
			const createFavoriteDto = plainToInstance(CreateFavoriteDto, {
				courseId: 999999
			})

			const response = await request(app.getHttpServer())
				.post('/api/favorites')
				.send(createFavoriteDto)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBeDefined()
			expect(response.body.message).toBe('course not found')
		})
	})
})
