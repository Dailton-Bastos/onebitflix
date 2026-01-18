import { Controller, Get, Query } from '@nestjs/common'
import { PaginationDto, PaginationOptionsDto } from 'src/common/pagination'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	async findAll(
		@Query() paginationOptionsDto?: PaginationOptionsDto
	): Promise<PaginationDto<Category>> {
		return this.categoriesService.findAll(paginationOptionsDto)
	}
}
