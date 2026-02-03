import { Type } from 'class-transformer'
import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxDate,
	MaxLength,
	MinDate,
	MinLength
} from 'class-validator'

import 'reflect-metadata'

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	firstName: string

	@IsString()
	@IsNotEmpty()
	@MinLength(2)
	lastName: string

	@IsString()
	@IsNotEmpty()
	@MinLength(11)
	@MaxLength(15)
	phone: string

	@IsDate()
	@Type(() => Date)
	@MinDate(new Date('1900-01-01'))
	@MaxDate(new Date())
	birth: Date

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(60)
	password: string
}
