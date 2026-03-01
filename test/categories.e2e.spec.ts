import { HttpStatus } from '@nestjs/common'
import { Order, PAGINATION_META_DEFAULT_VALUES } from 'src/common/constants'
import { PaginationOptionsDto } from 'src/common/pagination'
import request from 'supertest'
import { app, categoryRepository, courseRepository } from './setup'

describe('Categories (e2e)', () => {
	describe('GET /api/categories', () => {
		it('should return an array of categories', async () => {
			const categoryData = categoryRepository.create({
				name: 'test category',
				position: 1
			})

			const category = await categoryRepository.save(categoryData)

			const response = await request(app.getHttpServer())
				.get('/api/categories')
				.expect(HttpStatus.OK)

			expect(response.body.data[0].id).toBe(category.id)
			expect(response.body.data[0].name).toBe(category.name)
			expect(response.body.data[0].position).toBe(category.position)
		})

		it('should return an array of categories with pagination', async () => {
			const paginationOptionsDto: PaginationOptionsDto = {
				page: 1,
				take: 10,
				order: Order.ASC,
				skip: 0
			}

			const response = await request(app.getHttpServer())
				.get('/api/categories')
				.query(paginationOptionsDto)
				.expect(HttpStatus.OK)

			expect(response.body.data).toBeDefined()
			expect(response.body.meta).toBeDefined()
			expect(response.body.meta.hasNextPage).toBeDefined()
			expect(response.body.meta.hasPreviousPage).toBeDefined()
			expect(response.body.meta.page).toBeDefined()
			expect(response.body.meta.take).toBeDefined()
			expect(response.body.meta.itemCount).toBeDefined()
			expect(response.body.meta.pageCount).toBeDefined()
		})

		it('should return an array of categories with default pagination options', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/categories')
				.expect(HttpStatus.OK)

			expect(response.body.data).toBeInstanceOf(Array)
			expect(response.body.meta.hasNextPage).toBeFalsy()
			expect(response.body.meta.hasPreviousPage).toBeFalsy()
			expect(response.body.meta.page).toBe(
				PAGINATION_META_DEFAULT_VALUES.options.page
			)
			expect(response.body.meta.take).toBe(
				PAGINATION_META_DEFAULT_VALUES.options.take
			)
			expect(response.body.meta.itemCount).toBe(
				PAGINATION_META_DEFAULT_VALUES.itemCount
			)
			expect(response.body.meta.pageCount).toBe(0)
		})
	})

	describe('GET /api/categories/:id', () => {
		it('should return an error if the category is not found', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/categories/1')
				.expect(HttpStatus.NOT_FOUND)

			expect(response.body.message).toBe('category not found')
		})

		it('should return a category with courses', async () => {
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
				.get(`/api/categories/${category.id}`)
				.expect(HttpStatus.OK)

			expect(response.body.id).toBe(category.id)
			expect(response.body.name).toBe(category.name)
			expect(response.body.position).toBe(category.position)
			expect(response.body.courses).toBeDefined()
			expect(response.body.courses[0].id).toEqual(course.id)
			expect(response.body.courses[0].name).toEqual(course.name)
			expect(response.body.courses[0].synopsis).toEqual(course.synopsis)
			expect(response.body.courses[0].featured).toEqual(course.featured)
			expect(response.body.courses[0].thumbnailUrl).toEqual(course.thumbnailUrl)
			expect(response.body.courses[0].categoryId).toEqual(course.categoryId)
		})

		it('should return a existing category without createdAt and updatedAt properties', async () => {
			const categoryData = categoryRepository.create({
				name: 'test category',
				position: 1
			})

			const category = await categoryRepository.save(categoryData)

			const response = await request(app.getHttpServer())
				.get(`/api/categories/${category.id}`)
				.expect(HttpStatus.OK)

			expect(response.body).toBeDefined()
			expect(response.body.id).toBe(category.id)
			expect(response.body.createdAt).toBeUndefined()
			expect(response.body.updatedAt).toBeUndefined()
		})
	})
})
