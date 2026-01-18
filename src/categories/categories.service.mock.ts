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
		findAll: jest.fn().mockResolvedValue({
			data: [categoryMock],
			total: 1,
			page: 1,
			perPage: 1,
			nextPage: null,
			previousPage: null
		})
	}
}

export const CategoryRespositoryMock: Provider<MockType<Repository<Category>>> =
	{
		provide: getRepositoryToken(Category),
		useValue: {
			findAndCount: jest.fn().mockResolvedValue([[categoryMock], 1])
		}
	}
