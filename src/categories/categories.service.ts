import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DEFAULT_PAGINATION_LIMIT, Order } from 'src/common/constants'
import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionsDto
} from 'src/common/pagination'
import { Repository } from 'typeorm'
import { Category } from './category.entity'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>
	) {}

	async findAll(
		paginationOptionsDto?: PaginationOptionsDto
	): Promise<PaginationDto<Category>> {
		const {
			order = Order.ASC,
			take = DEFAULT_PAGINATION_LIMIT,
			skip = 0,
			page = 1
		} = paginationOptionsDto ?? {}

		const [categories, itemCount] = await this.categoryRepository.findAndCount({
			order: { position: order },
			take,
			skip
		})

		const paginationMeta = new PaginationMetaDto({
			itemCount,
			options: { order, take, skip, page }
		})

		return new PaginationDto(categories, paginationMeta)
	}

	async findByIdWithCourses(id: number): Promise<Category> {
		const category = await this.categoryRepository.findOne({
			where: { id },
			relations: {
				courses: true
			}
		})

		if (!category) {
			throw new NotFoundException('category not found')
		}

		return category
	}
}
