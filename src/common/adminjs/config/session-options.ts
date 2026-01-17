import type { SessionOptions } from 'express-session'
import { configService } from 'src/config/dotenv.config'

export const sessionOptions: SessionOptions = {
	resave: true,
	saveUninitialized: true,
	secret: configService.getOrThrow<string>('ADMINJS_SESSION_SECRET'),
	cookie: {
		maxAge: 1000 * 60 * 60 * 24, // 1 day
		httpOnly: true,
		secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
		sameSite: 'strict'
	}
}
