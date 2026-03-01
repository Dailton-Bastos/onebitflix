import { ClassConstructor, Type } from 'class-transformer'
import { IsArray } from 'class-validator'
import { PaginationMetaDto } from '../pagination'

export function PaginationResponseDto<T>(dto: ClassConstructor<T>) {
	class DecoratedPaginationDto {
		@IsArray()
		@Type(() => dto)
		readonly data: Array<typeof dto> = []

		@Type(() => PaginationMetaDto)
		readonly meta: PaginationMetaDto
	}

	return DecoratedPaginationDto
}
