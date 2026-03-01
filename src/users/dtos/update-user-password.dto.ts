import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserPasswordDto {
	@IsString()
	@IsNotEmpty()
	currentPassword: string = ''

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(60)
	newPassword: string = ''
}
