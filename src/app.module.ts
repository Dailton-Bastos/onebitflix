import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { CategoriesModule } from './categories/categories.module'
import { CookiesModule } from './common/cookies/cookies.module'
import { adminjsConfig } from './config/adminjs.config'
import { validate } from './config/env.validation'
import { serveStaticConfig } from './config/serve-static.config'
import { typeOrmConfig } from './config/typeOrm.config'
import { CoursesModule } from './courses/courses.module'
import { EpisodesModule } from './episodes/episodes.module'
import { FavoritesModule } from './favorites/favorites.module'
import { HealthModule } from './health/health.module'
import { LikesModule } from './likes/likes.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}.local`,
			validate
		}),
		ScheduleModule.forRoot(),
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
		CookiesModule,
		HealthModule,
		CategoriesModule,
		CoursesModule,
		EpisodesModule,
		UsersModule,
		AuthModule,
		FavoritesModule,
		LikesModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		}
	]
})
export class AppModule {}
