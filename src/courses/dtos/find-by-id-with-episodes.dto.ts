import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class FindByIdWithEpisodesDto {
	@IsNumber()
	@IsNotEmpty()
	@IsPositive()
	@Transform(({ value }) => Number(value))
	id: number
}
