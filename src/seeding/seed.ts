import { Logger } from '@nestjs/common'
import { runSeeders } from 'typeorm-extension'
import CategoryFactory from '../categories/category.factory'
import CategorySeeder from '../categories/category.seeder'
import dataSource from '../config/data-source.config'
import CourseFactory from '../courses/course.factory'
import CourseSeeder from '../courses/course.seeder'

const logger = new Logger('Seeding')

;(async () => {
	try {
		logger.log('Starting seeding waiting for database to be ready 🕐...')

		await dataSource.initialize().catch((error) => {
			logger.error('Failed to connect to database 💥')
			logger.error(error)
			process.exit(1)
		})

		logger.log('Database is ready, starting seeding 🚀...')

		await runSeeders(dataSource, {
			seeds: [CategorySeeder, CourseSeeder],
			factories: [CategoryFactory, CourseFactory]
		})

		logger.log('Seeding completed successfully 🎉...')
	} catch {
		logger.error('Seeding failed 💥...')
		process.exit(1)
	}

	await dataSource.destroy()
	logger.log('Database connection closed 🔌...')
})()
