import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { PaginationOptionsDto } from './pagination-options.dto'

describe('PaginationOptionsDto', () => {
	it('should be defined', () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			order: 'ASC',
			page: 1,
			take: 10
		})

		expect(dto).toBeDefined()
	})

	it('should fails validation if page is not a number', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			page: 'invalid-page',
			take: 10
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('page')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isInt).toBeTruthy()
	})

	it('should fails validation if page is less than 1', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			page: -1,
			take: 10
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('page')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.min).toBeTruthy()
	})

	it('should fails validation if take is not a number', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			take: 'invalid-take',
			page: 1
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('take')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isInt).toBeTruthy()
	})

	it('should fails validation if take is less than 0', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			take: -1,
			page: 1
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('take')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.min).toBeTruthy()
	})

	it('should fails validation if take is greater than 100', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			take: 101,
			page: 1
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('take')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.max).toBeTruthy()
	})

	it('should fails validation if order is not a valid enum value', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			page: 1,
			take: 10,
			order: 'INVALID-ORDER'
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('order')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isEnum).toBeTruthy()
	})

	it('should pass validation if page, take, and order are valid', async () => {
		const dto = plainToInstance(PaginationOptionsDto, {
			page: 1,
			take: 10,
			order: 'ASC'
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(0)
	})
})
