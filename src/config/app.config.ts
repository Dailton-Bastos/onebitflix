import { type INestApplication, ValidationPipe } from '@nestjs/common'

export const appConfig = (app: INestApplication) => {
	app.useGlobalPipes(
		new ValidationPipe({
			transform: false,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	app.setGlobalPrefix('api')
}
