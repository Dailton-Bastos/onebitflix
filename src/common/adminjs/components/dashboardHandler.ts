import { Category } from 'src/categories/category.entity'
import { UserRole } from 'src/common/constants'
import dataSource from 'src/config/data-source.config'
import { Course } from 'src/courses/course.entity'
import { Episode } from 'src/episodes/episode.entity'
import { User } from 'src/users/user.entity'

export interface DashboardHandler {
	Courses: number
	Episodes: number
	Users: number
	Categories: number
}

export const dashboardHandler = async (): Promise<DashboardHandler> => {
	if (!dataSource.isInitialized) {
		try {
			await dataSource.initialize()
		} catch {
			return {
				Courses: 0,
				Episodes: 0,
				Users: 0,
				Categories: 0
			}
		}
	}

	const [courses, episodes, users, categories] = await Promise.all([
		dataSource.getRepository(Course).count(),
		dataSource.getRepository(Episode).count(),
		dataSource.getRepository(User).count({ where: { role: UserRole.USER } }),
		dataSource.getRepository(Category).count()
	])

	return {
		Courses: courses,
		Episodes: episodes,
		Users: users,
		Categories: categories
	}
}
