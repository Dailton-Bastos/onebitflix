import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/env.validation'
import { HealthModule } from './health/health.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}.local`,
			validate
		}),
		HealthModule
	]
})
export class AppModule {}
