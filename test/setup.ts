import type { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from 'src/categories/categories.module'
import { Category } from 'src/categories/category.entity'
import { appConfig } from 'src/config/app.config'
import { validate } from 'src/config/env.validation'
import { serveStaticConfig } from 'src/config/serve-static.config'
import { typeOrmConfig } from 'src/config/typeOrm.config'
import { Course } from 'src/courses/course.entity'
import { CoursesModule } from 'src/courses/courses.module'
import { Episode } from 'src/episodes/episode.entity'
import { EpisodesModule } from 'src/episodes/episodes.module'
import { HealthModule } from 'src/health/health.module'
import type { App } from 'supertest/types'
import { Repository } from 'typeorm'

let app: INestApplication<App>
let categoryRepository: Repository<Category>
let courseRepository: Repository<Course>
let episodeRepository: Repository<Episode>

global.beforeEach(async () => {
	const module: TestingModule = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({
				isGlobal: true,
				envFilePath: '.env.test.local',
				validate
			}),
			ServeStaticModule.forRoot(serveStaticConfig()),
			TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
			HealthModule,
			CategoriesModule,
			CoursesModule,
			EpisodesModule
		]
	}).compile()

	app = module.createNestApplication<INestApplication<App>>()
	categoryRepository = module.get<Repository<Category>>(
		getRepositoryToken(Category)
	)
	courseRepository = module.get<Repository<Course>>(getRepositoryToken(Course))
	episodeRepository = module.get<Repository<Episode>>(
		getRepositoryToken(Episode)
	)

	appConfig(app)

	await app.init()
})

global.afterEach(async () => await app.close())

export { app, categoryRepository, courseRepository, episodeRepository }
