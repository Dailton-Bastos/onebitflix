import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { PaginationMetaDto } from './pagination-meta.dto'

export class PaginationDto<T> {
	@IsArray()
	readonly data: T[]

	@Type(() => PaginationMetaDto)
	@ValidateNested()
	readonly meta: PaginationMetaDto

	constructor(data: T[], meta: PaginationMetaDto) {
		this.data = data
		this.meta = meta
	}
}
