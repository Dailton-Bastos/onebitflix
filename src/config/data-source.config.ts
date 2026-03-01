import { DataSource } from 'typeorm'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js'
import { configService } from './dotenv.config'

export const dataSourceOptions: PostgresConnectionOptions = {
	type: 'postgres',
	host: configService.getOrThrow<string>('DATABASE_HOST'),
	port: Number(configService.getOrThrow<number>('DATABASE_PORT')),
	username: configService.getOrThrow<string>('DATABASE_USER'),
	password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
	database: configService.getOrThrow<string>('DATABASE_NAME'),
	synchronize: Boolean(
		Number(configService.getOrThrow<number>('DATABASE_SYNCHRONIZE'))
	),
	dropSchema: Boolean(
		Number(configService.getOrThrow<number>('DATABASE_DROP_SCHEMA'))
	),
	entities: [`${__dirname}/../**/*.entity.{js,ts}`],
	migrations: [`${__dirname}/../migrations/*.{js,ts}`]
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
