import { HttpStatus } from '@nestjs/common'
import { Order } from 'src/common/constants'
import { SearchDto } from 'src/courses/dtos'
import request from 'supertest'
import {
	app,
	categoryRepository,
	courseRepository,
	episodeRepository
} from './setup'

describe('Courses (e2e)', () => {
	describe('GET /api/courses/:id', () => {
		it('should throw an error if the course is not found', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/courses/1')
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBe('course not found')
		})

		it('should find a course by id', async () => {
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

			const course = await courseRepository.save(courseData)

			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(course.id)
			expect(response.body.name).toBe(course.name)
			expect(response.body.synopsis).toBe(course.synopsis)
			expect(response.body.featured).toBe(course.featured)
			expect(response.body.thumbnailUrl).toBe(course.thumbnailUrl)
			expect(response.body.categoryId).toBe(course.categoryId)
		})

		it('should return a existing course without createdAt and updatedAt properties', async () => {
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

			const course = await courseRepository.save(courseData)

			const response = await request(app.getHttpServer())
				.get(`/api/courses/${course.id}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(course.id)
			expect(response.body.createdAt).toBeUndefined()
			expect(response.body.updatedAt).toBeUndefined()
		})

		it('should return a course with episodes', async () => {
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

			const course = await courseRepository.save(courseData)

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

			const course = await courseRepository.save(courseData)

			const response = await request(app.getHttpServer())
				.get('/api/courses/search')
				.query({ name: 'test' })
				.expect(HttpStatus.OK)

			expect(response.body.data[0].id).toBe(course.id)
			expect(response.body.data[0].name).toBe(course.name)
		})

		it('should return courses by name with pagination', async () => {
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

			const course = await courseRepository.save(courseData)

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
			const categoryData = categoryRepository.create({
				name: 'test category',
				position: 1
			})

			const category = await categoryRepository.save(categoryData)

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
			const categoryData = categoryRepository.create({
				name: 'test category',
				position: 1
			})

			const category = await categoryRepository.save(categoryData)

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
