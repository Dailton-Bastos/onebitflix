import { Provider } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { userMock } from 'src/users/users.service.mock'
import { AuthService } from './auth.service'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const AuthServiceMock: Provider<MockType<AuthService>> = {
	provide: AuthService,
	useValue: {
		register: jest.fn().mockResolvedValue(userMock),
		login: jest.fn().mockReturnValue({
			access_token: 'mock-token'
		})
	}
}

export const JwtServiceMock: Provider<MockType<JwtService>> = {
	provide: JwtService,
	useValue: {
		sign: jest.fn().mockReturnValue('mock-token')
	}
}
