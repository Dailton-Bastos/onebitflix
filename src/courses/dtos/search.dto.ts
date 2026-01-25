import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationOptionsDto } from 'src/common/pagination'

export class SearchDto extends PaginationOptionsDto {
	@IsString()
	@IsNotEmpty()
	name: string
}
