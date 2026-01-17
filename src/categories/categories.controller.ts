import { Controller, Get } from '@nestjs/common'
import { Serialize } from '../common/interceptors/serialize.interceptor'
import { CategoriesService } from './categories.service'
import { Category } from './category.entity'
import { CategoryDto } from './dtos/category.dto'

@Controller('categories')
@Serialize<CategoryDto>(CategoryDto)
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	async findAll(): Promise<Category[]> {
		return this.categoriesService.findAll()
	}
}
