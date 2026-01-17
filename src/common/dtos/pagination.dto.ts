import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(100)
	limit?: number

	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsNumber()
	@Min(0)
	offset?: number
}
