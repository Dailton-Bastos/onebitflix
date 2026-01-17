import type { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { appConfig } from 'src/config/app.config'
import { validate } from 'src/config/env.validation'
import { serveStaticConfig } from 'src/config/serve-static.config'
import { typeOrmConfig } from 'src/config/typeOrm.config'
import { HealthModule } from 'src/health/health.module'
import type { App } from 'supertest/types'

export let app: INestApplication<App>

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
			HealthModule
		]
	}).compile()

	app = module.createNestApplication<INestApplication<App>>()

	appConfig(app)

	await app.init()
})

global.afterEach(async () => await app.close())
