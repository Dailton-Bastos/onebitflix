import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

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
	@IsNotEmpty()
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
