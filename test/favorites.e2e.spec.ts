import { HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { CourseDto } from 'src/courses/dtos/course.dto'
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
			const course = await courseRepository.findOneOrFail({
				where: { name: 'test course' }
			})
			const createFavoriteDto = plainToInstance(CreateFavoriteDto, {
				courseId: course.id
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

	describe('GET /api/favorites', () => {
		it('should return a pagination of favorites courses by user id', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/favorites')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body.data).toBeDefined()
			expect(response.body.meta).toBeDefined()
			expect(response.body.data).toBeInstanceOf(Array<CourseDto>)
		})
	})

	describe('DELETE /api/favorites/:courseId', () => {
		it('should delete a favorite', async () => {
			const course = await courseRepository.findOneOrFail({
				where: { name: 'test course' }
			})
			const createFavoriteDto = plainToInstance(CreateFavoriteDto, {
				courseId: course.id
			})

			await request(app.getHttpServer())
				.post('/api/favorites')
				.send(createFavoriteDto)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.CREATED)

			const response = await request(app.getHttpServer())
				.delete(`/api/favorites/${course.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.NO_CONTENT)

			expect(response.body).toEqual({})
		})

		it('should return a 404 error if the favorite is not found', async () => {
			const response = await request(app.getHttpServer())
				.delete('/api/favorites/999999')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBeDefined()
			expect(response.body.message).toBe('favorite not found')
		})
	})
})
