import { faker } from '@faker-js/faker'
import { Course } from 'src/courses/course.entity'
import { DataSource } from 'typeorm'
import { type Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Episode } from './episode.entity'

export default class EpisodeSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager
	): Promise<void> {
		const repository = dataSource.getRepository(Episode)
		const episodeFactory = factoryManager.get(Episode)

		const courseRepository = dataSource.getRepository(Course)

		const courses = await courseRepository.find({ take: 15, skip: 0 })

		const episodes = await Promise.all(
			Array.from({ length: 15 }).map(async () => {
				return episodeFactory.make({
					course: faker.helpers.arrayElement(courses)
				})
			})
		)

		await repository.save(episodes)
	}
}
