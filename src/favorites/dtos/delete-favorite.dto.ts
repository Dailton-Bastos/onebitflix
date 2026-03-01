import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class DeleteFavoriteDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@Transform(({ value }) => Number(value))
	courseId: number
}
