import Connect from 'connect-pg-simple'
import type { SessionOptions } from 'express-session'
import session from 'express-session'
import { dataSourceOptions } from 'src/config/data-source.config'
import { configService } from 'src/config/dotenv.config'

const ConnectSession = Connect(session)

const sessionStore = new ConnectSession({
	conObject: {
		host: dataSourceOptions.host,
		port: dataSourceOptions.port,
		user: dataSourceOptions.username,
		password: dataSourceOptions.password,
		database: dataSourceOptions.database
	},
	tableName: 'adminjs_sessions',
	createTableIfMissing: true
})

const isProduction =
	configService.getOrThrow<string>('NODE_ENV') === 'production'

export const sessionOptions: SessionOptions = {
	resave: false,
	saveUninitialized: false,
	secret: configService.getOrThrow<string>('ADMINJS_SESSION_SECRET'),
	cookie: {
		maxAge: 1000 * 60 * 60 * 24, // 1 day
		httpOnly: isProduction,
		secure: isProduction,
		sameSite: 'strict'
	},
	name: 'adminjs-session',
	store: sessionStore
}
