import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js'

const ENV = process.env.NODE_ENV ?? 'development'

config({ path: `.env.${ENV}.local` })

const configService = new ConfigService()

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
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
