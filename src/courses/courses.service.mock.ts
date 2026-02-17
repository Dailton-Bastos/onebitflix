import { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { QueryBuilder, Repository } from 'typeorm'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const courseMock = {
	id: 1,
	name: 'course',
	synopsis: 'synopsis',
	featured: false,
	categoryId: 1
} as Course

export const CoursesServiceMock: Provider<MockType<CoursesService>> = {
	provide: CoursesService,
	useValue: {
		findByIdWithEpisodes: jest.fn().mockResolvedValue({
			...courseMock,
			episodes: [episodeMock]
		}),
		getRandomFeaturedCourses: jest.fn().mockResolvedValue([
			{
				...courseMock,
				id: 1
			},
			{
				...courseMock,
				id: 2
			},
			{
				...courseMock,
				id: 3
			}
		] as Course[]),
		getTopTenNewestCourses: jest.fn().mockResolvedValue(
			Array(10)
				.fill(null)
				.map((_, index) => ({
					...courseMock,
					id: index + 1
				})) as Course[]
		),
		searchByCourseName: jest.fn().mockResolvedValue({
			data: [courseMock],
			meta: {
				page: 1,
				take: 10,
				itemCount: 1,
				pageCount: 1,
				hasPreviousPage: false,
				hasNextPage: false
			}
		}),
		findById: jest.fn().mockResolvedValue(courseMock)
	}
}

export const CourseRepositoryMock: Provider<MockType<Repository<Course>>> = {
	provide: getRepositoryToken(Course),
	useValue: {
		findOne: jest.fn().mockResolvedValue({
			...courseMock,
			episodes: [episodeMock]
		}),
		find: jest.fn().mockResolvedValue([
			{
				...courseMock,
				id: 1
			},
			{
				...courseMock,
				id: 2
			},
			{
				...courseMock,
				id: 3
			}
		] as Course[]),
		createQueryBuilder: jest.fn().mockReturnValue({
			where: jest.fn().mockReturnThis(),
			orderBy: jest.fn().mockReturnThis(),
			take: jest.fn().mockReturnThis(),
			getMany: jest.fn().mockResolvedValue([
				{ ...courseMock, id: 1 },
				{ ...courseMock, id: 2 },
				{ ...courseMock, id: 3 }
			] as Course[])
		} as unknown as QueryBuilder<Course>),
		findAndCount: jest.fn().mockResolvedValue([[courseMock], 1])
	}
}
