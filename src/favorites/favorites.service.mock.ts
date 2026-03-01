import { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Favorite } from './favorite.entity'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const FavoritesRepositoryMock: Provider<MockType<Repository<Favorite>>> =
	{
		provide: getRepositoryToken(Favorite),
		useValue: {
			create: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
			findOne: jest.fn()
		}
	}
