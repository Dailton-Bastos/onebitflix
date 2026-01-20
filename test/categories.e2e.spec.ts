import { HttpStatus } from '@nestjs/common'
import { CategoryDto } from 'src/categories/dtos'
import { Order, PAGINATION_META_DEFAULT_VALUES } from 'src/common/constants'
import { PaginationOptionsDto } from 'src/common/pagination'
import request from 'supertest'
import { app } from './setup'

describe('Categories (e2e)', () => {
	describe('GET /api/categories', () => {
		it('should return an array of categories', async () => {
			const response = await request(app.getHttpServer())
				.get('/api/categories')
				.expect(HttpStatus.OK)

			expect(response.body.data).toBeInstanceOf(Array<typeof CategoryDto>)
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

	afterAll(async () => {
		await app.close()
	})
})
