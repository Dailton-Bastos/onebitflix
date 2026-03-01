import type { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { courseMock } from 'src/courses/courses.service.mock'
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
			meta: {
				page: 1,
				take: 10,
				itemCount: 1,
				pageCount: 1,
				hasPreviousPage: false,
				hasNextPage: false
			}
		}),
		findByIdWithCourses: jest.fn().mockResolvedValue({
			...categoryMock,
			courses: [courseMock]
		})
	}
}

export const CategoryRepositoryMock: Provider<MockType<Repository<Category>>> =
	{
		provide: getRepositoryToken(Category),
		useValue: {
			findAndCount: jest.fn().mockResolvedValue([[categoryMock], 1]),
			findOne: jest.fn().mockResolvedValue({
				...categoryMock,
				courses: [courseMock]
			})
		}
	}
