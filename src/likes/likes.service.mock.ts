import { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Like } from './like.entity'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const LikesRepositoryMock: Provider<MockType<Repository<Like>>> = {
	provide: getRepositoryToken(Like),
	useValue: {
		create: jest.fn(),
		save: jest.fn(),
		delete: jest.fn(),
		findOne: jest.fn()
	}
}
