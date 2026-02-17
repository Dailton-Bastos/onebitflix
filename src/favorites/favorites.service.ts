import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DEFAULT_PAGINATION_LIMIT, Order } from 'src/common/constants'
import {
	PaginationDto,
	PaginationMetaDto,
	PaginationOptionsDto
} from 'src/common/pagination'
import { Course } from 'src/courses/course.entity'
import { CoursesService } from 'src/courses/courses.service'
import { Repository } from 'typeorm'
import { Favorite } from './favorite.entity'

@Injectable()
export class FavoritesService {
	constructor(
		@InjectRepository(Favorite)
		private readonly favoriteRepository: Repository<Favorite>,
		private readonly coursesService: CoursesService
	) {}

	async create(userId: number, courseId: number): Promise<Favorite> {
		const existingCourse = await this.coursesService.findById(courseId)

		if (!existingCourse) {
			throw new NotFoundException('course not found')
		}

		const favorite = this.favoriteRepository.create({ userId, courseId })

		return this.favoriteRepository.save(favorite)
	}

	async findByUserId(
		userId: number,
		paginationOptionsDto?: PaginationOptionsDto
	): Promise<PaginationDto<Course>> {
		const {
			order = Order.ASC,
			take = DEFAULT_PAGINATION_LIMIT,
			skip = 0,
			page = 1
		} = paginationOptionsDto ?? {}

		const [data, itemCount] = await this.favoriteRepository.findAndCount({
			where: { userId },
			relations: { course: true },
			order: { createdAt: order },
			take,
			skip
		})

		const courses = data.map((favorite) => favorite.course)

		const paginationMeta = new PaginationMetaDto({
			itemCount,
			options: { order, take, skip, page }
		})

		return new PaginationDto(courses, paginationMeta)
	}
}
