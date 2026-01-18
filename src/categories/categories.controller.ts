import { Controller, Get, Query } from '@nestjs/common'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { PaginatedResponseData } from 'src/common/interfaces'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	async findAll(
		@Query() paginationDto?: PaginationDto
	): Promise<PaginatedResponseData<Category[]>> {
		return this.categoriesService.findAll(paginationDto)
	}
}
