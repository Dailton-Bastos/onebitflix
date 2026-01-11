import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { appConfig } from './config/app.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	appConfig(app)

	const configService = app.get(ConfigService)

	const PORT = configService.getOrThrow<number>('PORT')
	const ENV = configService.getOrThrow<string>('NODE_ENV')

	await app.listen(PORT, () => {
		const logger = new Logger('Bootstrap')
		logger.log(`Server is running on port ${PORT} in ${ENV} mode`)
	})
}
bootstrap()
