import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateWatchTimeDto {
	@IsNotEmpty()
	@IsNumber()
	seconds: number
}
