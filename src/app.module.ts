import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { adminjsConfig } from './config/adminjs.config'
import { validate } from './config/env.validation'
import { serveStaticConfig } from './config/serve-static.config'
import { typeOrmConfig } from './config/typeOrm.config'
import { HealthModule } from './health/health.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}.local`,
			validate
		}),
		ServeStaticModule.forRoot(serveStaticConfig()),
		TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
		import('@adminjs/nestjs').then(({ AdminModule }) => {
			return AdminModule.createAdminAsync(adminjsConfig.asProvider())
		}),
		HealthModule
	]
})
export class AppModule {}
