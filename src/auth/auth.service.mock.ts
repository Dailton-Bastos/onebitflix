import { Provider } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { userMock } from 'src/users/users.service.mock'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { RefreshToken } from './refresh-token.entity'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

const refreshTokenMock = {
	id: 1,
	token: 'mock-token',
	expiresAt: new Date(),
	isRevoked: false,
	createdAt: new Date()
} as RefreshToken

export const AuthServiceMock: Provider<MockType<AuthService>> = {
	provide: AuthService,
	useValue: {
		register: jest.fn().mockResolvedValue(userMock),
		login: jest.fn().mockReturnValue({
			access_token: 'access-token',
			refresh_token: 'refresh-token'
		}),
		logout: jest.fn().mockResolvedValue(undefined)
	}
}

export const JwtServiceMock: Provider<MockType<JwtService>> = {
	provide: JwtService,
	useValue: {
		sign: jest.fn().mockReturnValue('mock-token')
	}
}

export const RefreshTokenRepositoryMock: Provider<
	MockType<Repository<RefreshToken>>
> = {
	provide: getRepositoryToken(RefreshToken),
	useValue: {
		findOne: jest.fn().mockResolvedValue(refreshTokenMock),
		create: jest.fn().mockReturnValue(refreshTokenMock),
		save: jest.fn().mockResolvedValue(refreshTokenMock),
		update: jest.fn().mockResolvedValue(undefined),
		createQueryBuilder: jest.fn().mockReturnValue({
			delete: jest.fn().mockReturnValue({
				from: jest.fn().mockReturnValue({
					where: jest.fn().mockReturnValue({
						orWhere: jest.fn().mockReturnValue({
							execute: jest.fn().mockResolvedValue(undefined)
						})
					})
				})
			})
		})
	}
}
