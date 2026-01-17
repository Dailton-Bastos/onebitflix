import { type INestApplication, ValidationPipe } from '@nestjs/common'

export const appConfig = (app: INestApplication) => {
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	app.setGlobalPrefix('api')
}
