import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

describe('CreateUserDto', () => {
	describe('firstName', () => {
		it('should be a string', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 123,
				lastName: 'Test',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('firstName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isString).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: '',
				lastName: 'Test',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('firstName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should be at least 2 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'T',
				lastName: 'Test',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})

			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('firstName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.minLength).toBeTruthy()
		})

		it('should pass validation if firstName is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Test',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})

			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
	describe('lastName', () => {
		it('should be a string', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 123,
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('lastName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isString).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: '',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('lastName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should be at least 2 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'T',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})

			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('lastName')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.minLength).toBeTruthy()
		})

		it('should pass validation if lastName is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})

			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
	describe('phone', () => {
		it('should be a string', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: 1234567890,
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('phone')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isString).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('phone')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should be at least 11 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '1234567890',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('phone')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.minLength).toBeTruthy()
		})

		it('should be at most 15 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '1234567890123456',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('phone')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.maxLength).toBeTruthy()
		})

		it('should pass validation if phone is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
	describe('birth', () => {
		it('should be a date', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('birth')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isDate).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '',
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('birth')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should pass validation if birth is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
	describe('email', () => {
		it('should be an email', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 1234567890,
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('email')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isEmail).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: '',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('email')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should pass validation if email is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 'password'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
	describe('password', () => {
		it('should be a string', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: 1234567890
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('password')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isString).toBeTruthy()
		})

		it('should be not empty', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: ''
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('password')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.isNotEmpty).toBeTruthy()
		})

		it('should be at least 8 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('password')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.minLength).toBeTruthy()
		})

		it('should be at most 60 characters long', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password:
					'1234567890123456789012345678901234567890123456789012345678901234'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(1)
			expect(errors[0].property).toBe('password')
			expect(errors[0].constraints).toBeDefined()
			expect(errors[0].constraints?.maxLength).toBeTruthy()
		})

		it('should pass validation if password is valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567890'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})

	describe('all fields', () => {
		it('should pass validation if all fields are valid', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: new Date('1990-01-01'),
				email: 'test@test.com',
				password: '1234567890'
			})
			const errors = await validate(dto)

			expect(errors.length).toBe(0)
		})
	})
})
