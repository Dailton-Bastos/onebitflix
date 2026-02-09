import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import type { Response } from 'express'
import { CreateUserDto } from 'src/users/dtos'
import { UsersServiceMock, userMock } from 'src/users/users.service.mock'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthServiceMock } from './auth.service.mock'

describe('AuthController', () => {
	let controller: AuthController
	let service: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [UsersServiceMock, AuthServiceMock]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		service = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('register', () => {
		it('should register a new user correctly', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			const result = await controller.register(dto)

			expect(service.register).toHaveBeenCalledWith(dto)

			expect(result.id).toEqual(userMock.id)
		})

		it('should return a new user without password', async () => {
			const dto = plainToInstance(CreateUserDto, {
				firstName: 'Test',
				lastName: 'Teste',
				phone: '123456789012345',
				birth: '1990-01-01',
				email: 'test@test.com',
				password: '1234567890'
			})

			const result = await controller.register(dto)

			expect(result.password).toBeUndefined()
		})
	})

	describe('login', () => {
		it('should login a user correctly', async () => {
			const response = {
				cookie: jest.fn()
			} as unknown as Response

			const result = await controller.login(userMock, response)

			expect(service.login).toHaveBeenCalledWith(userMock, response)

			expect(result).toEqual({
				access_token: expect.any(String)
			})
		})
	})
})
