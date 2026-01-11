import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { validate } from './config/env.validation'
import { typeOrmConfig } from './config/typeOrm.config'
import { HealthModule } from './health/health.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}.local`,
			validate
		}),
		TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
		HealthModule
	]
})
export class AppModule {}
