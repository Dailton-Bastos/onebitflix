import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { PaginationDto } from './pagination.dto'

describe('PaginationDto', () => {
	it('should be defined', () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 10,
			offset: 0
		})
		expect(dto).toBeDefined()
	})

	it('should fails validation if limit is not a number', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 'invalid-limit',
			offset: 0
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('limit')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isNumber).toBeTruthy()
	})

	it('should fails validation if limit is less than 1', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: -1,
			offset: 0
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('limit')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.min).toBeTruthy()
	})

	it('should fails validation if limit is greater than 100', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 101,
			offset: 0
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('limit')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.max).toBeTruthy()
	})

	it('should fails validation if offset is not a number', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 10,
			offset: 'invalid-offset'
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('offset')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isNumber).toBeTruthy()
	})

	it('should fails validation if offset is less than 0', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 10,
			offset: -1
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('offset')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.min).toBeTruthy()
	})

	it('should pass validation if limit and offset are valid', async () => {
		const dto = plainToInstance(PaginationDto, {
			limit: 10,
			offset: 2
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(0)
	})
})
