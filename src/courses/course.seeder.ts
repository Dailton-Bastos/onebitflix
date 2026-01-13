import { faker } from '@faker-js/faker'
import { DataSource } from 'typeorm'
import { type Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Category } from '../categories/category.entity'
import { Course } from './course.entity'

export default class CourseSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager
	): Promise<void> {
		const repository = dataSource.getRepository(Course)
		const courseFactory = factoryManager.get(Course)

		const categoryRepository = dataSource.getRepository(Category)

		const categories = await categoryRepository.find({ take: 30, skip: 0 })

		const courses = await Promise.all(
			Array.from({ length: 15 }).map(async () => {
				return courseFactory.make({
					category: faker.helpers.arrayElement(categories)
				})
			})
		)

		await repository.save(courses)
	}
}
