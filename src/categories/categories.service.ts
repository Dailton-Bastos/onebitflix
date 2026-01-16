import { Injectable } from '@nestjs/common'
import { Category } from './category.entity'

@Injectable()
export class CategoriesService {
	async findAll(): Promise<Category[]> {
		return []
	}
}
