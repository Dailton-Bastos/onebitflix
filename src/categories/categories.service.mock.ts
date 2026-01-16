import type { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const categoryMock = {
	id: 1,
	name: 'category',
	position: 1
} as Category

export const CategoriesServiceMock: Provider<MockType<CategoriesService>> = {
	provide: CategoriesService,
	useValue: {
		findAll: jest.fn().mockResolvedValue([categoryMock])
	}
}

export const CategoryRespositoryMock: Provider<MockType<Repository<Category>>> =
	{
		provide: getRepositoryToken(Category),
		useValue: {
			find: jest.fn().mockResolvedValue([categoryMock])
		}
	}
