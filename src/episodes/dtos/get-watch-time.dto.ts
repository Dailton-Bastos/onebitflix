import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class GetWatchTimeDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@Transform(({ value }) => Number(value))
	episodeId: number
}
