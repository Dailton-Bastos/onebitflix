import { CategoryDto } from 'src/categories/dtos'
import { PaginationResponseDto } from './pagination-response.dto'

export function CategoriesResponseDto() {
	return PaginationResponseDto(CategoryDto)
}
