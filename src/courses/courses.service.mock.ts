import { Course } from './course.entity'

export const courseMock = {
	id: 1,
	name: 'course',
	synopsis: 'synopsis',
	featured: false,
	categoryId: 1,
	createdAt: new Date(),
	updatedAt: new Date()
} as Course
