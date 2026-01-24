import { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { Repository } from 'typeorm'
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
	categoryId: 1,
	createdAt: new Date(),
	updatedAt: new Date()
} as Course

export const CoursesServiceMock: Provider<MockType<CoursesService>> = {
	provide: CoursesService,
	useValue: {
		findByIdWithEpisodes: jest.fn().mockResolvedValue({
			...courseMock,
			episodes: [episodeMock]
		})
	}
}

export const CourseRepositoryMock: Provider<MockType<Repository<Course>>> = {
	provide: getRepositoryToken(Course),
	useValue: {
		findOne: jest.fn().mockResolvedValue({
			...courseMock,
			episodes: [episodeMock]
		})
	}
}
