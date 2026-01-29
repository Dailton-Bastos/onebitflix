import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DEFAULT_PAGINATION_LIMIT, Order } from 'src/common/constants'
import { PaginationDto, PaginationMetaDto } from 'src/common/pagination'
import { ILike, Repository } from 'typeorm'
import { Course } from './course.entity'
import { SearchDto } from './dtos'

@Injectable()
export class CoursesService {
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>
	) {}

	async findByIdWithEpisodes(id: number): Promise<Course> {
		const course = await this.courseRepository.findOne({
			where: { id },
			relations: {
				episodes: true
			},
			order: { episodes: { order: Order.ASC } }
		})

		if (!course) {
			throw new NotFoundException('course not found')
		}

		return course
	}

	async getRandomFeaturedCourses(): Promise<Course[]> {
		const courses = await this.courseRepository
			.createQueryBuilder('courses')
			.where('courses.featured = :featured', { featured: true })
			.orderBy('RANDOM()')
			.take(3)
			.getMany()

		return courses
	}

	async getTopTenNewestCourses(): Promise<Course[]> {
		const courses = await this.courseRepository.find({
			take: 10,
			order: { createdAt: Order.DESC }
		})

		return courses
	}

	async searchByCourseName(
		searchDto: SearchDto
	): Promise<PaginationDto<Course>> {
		const { name } = searchDto

		const skip = (searchDto.page - 1) * searchDto.take

		const {
			order = Order.DESC,
			take = DEFAULT_PAGINATION_LIMIT,
			page = 1
		} = searchDto

		if (!name) {
			throw new BadRequestException('name is required')
		}

		const [courses, itemCount] = await this.courseRepository.findAndCount({
			where: { name: ILike(`%${name}%`) },
			order: { createdAt: order },
			take,
			skip
		})

		const paginationMeta = new PaginationMetaDto({
			itemCount,
			options: { order, take, skip, page }
		})

		return new PaginationDto(courses, paginationMeta)
	}
}
