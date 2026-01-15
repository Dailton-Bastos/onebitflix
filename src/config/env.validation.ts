import { plainToInstance } from 'class-transformer'
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
	validateSync
} from 'class-validator'

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test'
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment

	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsNotEmpty()
	PORT: number

	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsNotEmpty()
	DATABASE_PORT: number

	@IsString()
	@IsNotEmpty()
	DATABASE_USER: string

	@IsString()
	@IsNotEmpty()
	DATABASE_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	DATABASE_NAME: string

	@IsString()
	@IsNotEmpty()
	DATABASE_HOST: string

	@IsNumber()
	@Min(0)
	@Max(1)
	@IsNotEmpty()
	DATABASE_SYNCHRONIZE: number

	@IsNumber()
	@Min(0)
	@Max(1)
	@IsNotEmpty()
	DATABASE_DROP_SCHEMA: number

	@IsEmail()
	@IsNotEmpty()
	ADMINJS_DEFAULT_EMAIL: string

	@IsString()
	@IsNotEmpty()
	ADMINJS_DEFAULT_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	ADMINJS_COOKIE_NAME: string

	@IsString()
	@IsNotEmpty()
	ADMINJS_COOKIE_PASSWORD: string

	@IsString()
	@IsNotEmpty()
	ADMINJS_SESSION_SECRET: string

	@IsString()
	@IsNotEmpty()
	ADMINJS_LICENSE_KEY: string

	@IsString()
	@IsNotEmpty()
	ADMIN_JS_SKIP_BUNDLE: string

	@IsString()
	@IsNotEmpty()
	ADMIN_JS_TMP_DIR: string
}

export const validate = (config: Record<string, unknown>) => {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true
	})
	const errors = validateSync(validatedConfig, { skipMissingProperties: false })

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}
	return validatedConfig
}
