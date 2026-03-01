import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { SearchDto } from './search.dto'

describe('SearchDto', () => {
	it('should be defined', () => {
		const dto = plainToInstance(SearchDto, {
			name: 'test'
		})

		expect(dto).toBeDefined()
	})

	it('should fails validation if name is not a string', async () => {
		const dto = plainToInstance(SearchDto, {
			name: 123
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('name')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isString).toBeTruthy()
	})

	it('should fails validation if name is empty', async () => {
		const dto = plainToInstance(SearchDto, {
			name: ''
		})

		const errors = await validate(dto)

		expect(errors.length).toBe(1)
		expect(errors[0].property).toBe('name')
		expect(errors[0].constraints).toBeDefined()
		expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
	})
})
