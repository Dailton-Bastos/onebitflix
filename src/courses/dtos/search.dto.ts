import { OmitType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationOptionsDto } from 'src/common/pagination'

export class SearchDto extends OmitType(PaginationOptionsDto, ['skip']) {
	@IsString()
	@IsNotEmpty()
	name: string
}
