import { Provider } from '@nestjs/common'
import { userMock } from 'src/users/users.service.mock'
import { AuthService } from './auth.service'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const AuthServiceMock: Provider<MockType<AuthService>> = {
	provide: AuthService,
	useValue: {
		register: jest.fn().mockResolvedValue(userMock)
	}
}
