import { plainToInstance } from 'class-transformer'
import {
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
