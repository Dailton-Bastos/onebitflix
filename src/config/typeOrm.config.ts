import { registerAs } from '@nestjs/config'
import { dataSourceOptions } from './data-source.config'

export const typeOrmConfig = registerAs('typeorm', () => ({
	type: dataSourceOptions.type,
	host: dataSourceOptions.host,
	port: dataSourceOptions.port,
	username: dataSourceOptions.username,
	password: dataSourceOptions.password,
	database: dataSourceOptions.database,
	synchronize: dataSourceOptions.synchronize,
	dropSchema: dataSourceOptions.dropSchema,
	entities: dataSourceOptions.entities,
	migrations: dataSourceOptions.migrations
}))
