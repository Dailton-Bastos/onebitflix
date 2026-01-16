import type { Provider } from '@nestjs/common'
import { Course } from 'src/courses/course.entity'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'

export const categoryMock = {
	id: 1,
	name: 'category',
	position: 1,
	createdAt: new Date(),
	updatedAt: new Date(),
	courses: [] as Course[]
} as Category

export const categoriesServiceMock: Provider = {
	provide: CategoriesService,
	useValue: {
		findAll: jest.fn().mockResolvedValue([categoryMock])
	}
}
