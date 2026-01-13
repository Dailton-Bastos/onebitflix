import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesModule } from './categories/categories.module'
import { adminjsConfig } from './config/adminjs.config'
import { validate } from './config/env.validation'
import { serveStaticConfig } from './config/serve-static.config'
import { typeOrmConfig } from './config/typeOrm.config'
import { CoursesModule } from './courses/courses.module'
import { EpisodesModule } from './episodes/episodes.module'
import { HealthModule } from './health/health.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}.local`,
			validate
		}),
		ServeStaticModule.forRoot(serveStaticConfig()),
		TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
		// AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
		Promise.all([
			import('@adminjs/nestjs'),
			import('@adminjs/typeorm'),
			import('adminjs')
		]).then(
			([{ AdminModule }, { Database, Resource }, { default: AdminJS }]) => {
				AdminJS.registerAdapter({ Database, Resource })

				return AdminModule.createAdminAsync(adminjsConfig.asProvider())
			}
		),
		HealthModule,
		CategoriesModule,
		CoursesModule,
		EpisodesModule,
		UsersModule
	]
})
export class AppModule {}
