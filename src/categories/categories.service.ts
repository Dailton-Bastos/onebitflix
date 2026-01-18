import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/constants'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { PaginatedResponseData } from 'src/common/interfaces'
import { Repository } from 'typeorm'
import { Category } from './category.entity'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>
	) {}

	async findAll(
		paginationDto?: PaginationDto
	): Promise<PaginatedResponseData<Category[]>> {
		const { limit = DEFAULT_PAGINATION_LIMIT, offset = 0 } = paginationDto ?? {}

		const page = Math.floor(offset / limit) + 1
		const perPage = limit

		const [categories, total] = await this.categoryRepository.findAndCount({
			order: { position: 'ASC' },
			take: limit,
			skip: offset // limit * (page - 1)
		})

		const nextPage =
			total > offset + limit ? Math.floor(offset / limit) + 2 : null

		const previousPage = page > 1 ? Math.floor(offset / limit) : null

		return { data: categories, total, page, perPage, nextPage, previousPage }
	}
}
