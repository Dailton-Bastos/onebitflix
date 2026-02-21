import { HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { Category } from 'src/categories/category.entity'
import { Order } from 'src/common/constants'
import { Course } from 'src/courses/course.entity'
import { SearchDto } from 'src/courses/dtos'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import request from 'supertest'
import {
	app,
	categoryRepository,
	courseRepository,
	episodeRepository
} from './setup'

describe('Courses (e2e)', () => {
	let accessToken: string
	let category: Category
	let course: Course

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

		category = await categoryRepository.save(categoryData)

		const courseData = courseRepository.create({
			name: 'test course',
			synopsis: 'test synopsis',
			category
		})

		course = await courseRepository.save(courseData)
	})

	describe('GET /api/courses/:id', () => {
		it('should throw an error if the course is not found', async () => {
			await courseRepository.delete(course.id)

			const response = await request(app.getHttpServer())
				.get('/api/courses/1')
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBe('course not found')
		})

		it('should find a course by id', async () => {
			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(course.id)
			expect(response.body.name).toBe(course.name)
			expect(response.body.synopsis).toBe(course.synopsis)
			expect(response.body.featured).toBe(course.featured)
			expect(response.body.thumbnailUrl).toBe(course.thumbnailUrl)
			expect(response.body.categoryId).toBe(course.categoryId)
		})

		it('should return a existing course without createdAt and updatedAt properties', async () => {
			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(course.id)
			expect(response.body.createdAt).toBeUndefined()
			expect(response.body.updatedAt).toBeUndefined()
		})

		it('should return a course with episodes', async () => {
			const episodeData = episodeRepository.create({
				name: 'test episode',
				synopsis: 'test synopsis',
				order: 1,
				videoUrl: 'videos/course-1/episode-1.mp4',
				secondsLong: 100,
				course
			})

			const episode = await episodeRepository.save(episodeData)

			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(course.id)
			expect(response.body.categoryId).toBe(course.categoryId)
			expect(response.body.episodes).toBeDefined()
			expect(response.body.episodes[0].id).toBe(episode.id)
			expect(response.body.episodes[0].name).toBe(episode.name)
			expect(response.body.episodes[0].synopsis).toBe(episode.synopsis)
			expect(response.body.episodes[0].order).toBe(episode.order)
			expect(response.body.episodes[0].videoUrl).toBe(episode.videoUrl)
			expect(response.body.episodes[0].secondsLong).toBe(episode.secondsLong)
			expect(response.body.episodes[0].createdAt).toBeUndefined()
			expect(response.body.episodes[0].updatedAt).toBeUndefined()
		})

		it('should return a course with isLiked and isFavorite properties', async () => {
			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(HttpStatus.OK)

			expect(response.body.isLiked).toBe(false)
			expect(response.body.isFavorite).toBe(false)
		})
	})

	describe('GET /api/courses/search', () => {
		it('should throw an error if the name is empty', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/courses/search')
				.query({ name: '' })
				.expect(HttpStatus.BAD_REQUEST)

			expect(response.body.message).toContain('name should not be empty')
		})

		it('should return courses by name', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/courses/search')
				.query({ name: 'test' })
				.expect(HttpStatus.OK)

			expect(response.body.data[0].id).toBe(course.id)
			expect(response.body.data[0].name).toBe(course.name)
		})

		it('should return courses by name with pagination', async () => {
			const searchDto: SearchDto = {
				name: 'test',
				page: 1,
				take: 10,
				order: Order.DESC
			}

			const response = await request(app.getHttpServer())
				.get('/api/courses/search')
				.query(searchDto)
				.expect(HttpStatus.OK)

			expect(response.body.data).toBeDefined()
			expect(response.body.data[0].id).toBe(course.id)
			expect(response.body.data[0].name).toBe(course.name)
			expect(response.body.meta).toBeDefined()
			expect(response.body.meta.hasNextPage).toBe(false)
			expect(response.body.meta.hasPreviousPage).toBe(false)
			expect(response.body.meta.page).toBe(searchDto.page)
			expect(response.body.meta.take).toBe(searchDto.take)
			expect(response.body.meta.itemCount).toBe(1)
			expect(response.body.meta.pageCount).toBe(1)
		})

		it('should throw an error if pass invalid query params', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/courses/search')
				.query({ name: 'test', page: 'invalid', take: 'invalid', skip: 10 })
				.expect(HttpStatus.BAD_REQUEST)

			expect(response.body.message).toContain('page must be an integer number')
			expect(response.body.message).toContain('take must be an integer number')
			expect(response.body.message).toContain('property skip should not exist')
		})
	})

	describe('GET /api/courses/featured', () => {
		it('should return three random featured courses', async () => {
			const coursesData = await Promise.all(
				Array.from({ length: 5 }).map(async (_, index) => {
					return courseRepository.create({
						name: `test course ${index + 1}`,
						synopsis: 'test synopsis',
						featured: true,
						category
					})
				})
			)

			await courseRepository.save(coursesData)

			const response = await request(app.getHttpServer())
				.get('/api/courses/featured')
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(response.body.length).toBe(3)
			expect(response.body[0]).not.toBe(response.body[1])
			expect(response.body[0]).not.toBe(response.body[2])
			expect(response.body[1]).not.toBe(response.body[2])
		})
	})

	describe('GET /api/courses/newest', () => {
		it('should return ten newest courses', async () => {
			const coursesData = await Promise.all(
				Array.from({ length: 15 }).map(async (_, index) => {
					return courseRepository.create({
						name: `test course ${index + 1}`,
						synopsis: 'test synopsis',
						category
					})
				})
			)

			await courseRepository.save(coursesData)

			const response = await request(app.getHttpServer())
				.get('/api/courses/newest')
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(response.body.length).toBe(10)
		})
	})
})
