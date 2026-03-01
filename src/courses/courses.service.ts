import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DEFAULT_PAGINATION_LIMIT, Order } from 'src/common/constants'
import { PaginationDto, PaginationMetaDto } from 'src/common/pagination'
import { Favorite } from 'src/favorites/favorite.entity'
import { Like } from 'src/likes/like.entity'
import { ILike, Repository } from 'typeorm'
import { Course } from './course.entity'
import { CourseDto, SearchDto } from './dtos'

@Injectable()
export class CoursesService {
	constructor(
		@InjectRepository(Course)
		private readonly courseRepository: Repository<Course>,
		@InjectRepository(Like)
		private readonly likeRepository: Repository<Like>,
		@InjectRepository(Favorite)
		private readonly favoriteRepository: Repository<Favorite>
	) {}

	async findByIdWithEpisodes(
		userId: number,
		courseId: number
	): Promise<CourseDto> {
		const course = await this.courseRepository.findOne({
			where: { id: courseId },
			relations: {
				episodes: true
			},
			order: { episodes: { order: Order.ASC } }
		})

		if (!course) {
			throw new NotFoundException('course not found')
		}

		const [isLiked, isFavorite] = await Promise.all([
			this.isLiked(userId, courseId),
			this.isFavorite(userId, courseId)
		])

		return {
			...course,
			isLiked,
			isFavorite
		}
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

	async findById(id: number): Promise<Course | null> {
		const course = await this.courseRepository.findOne({ where: { id } })

		return course
	}

	async getTopTenMostLikedCourses(): Promise<Course[]> {
		/*
			SELECT
        courses.id,
        courses.name,
        courses.synopsis,
        courses.thumbnail_url as thumbnailUrl,
        COUNT(users.id) AS likes
      FROM courses
        LEFT OUTER JOIN likes
          ON courses.id = likes.course_id
          INNER JOIN users
            ON users.id = likes.user_id
      GROUP BY courses.id
      ORDER BY likes DESC
      LIMIT 10;
		*/
		const courses = await this.courseRepository
			.createQueryBuilder('courses')
			.select('courses.id', 'id')
			.addSelect('courses.name', 'name')
			.addSelect('courses.synopsis', 'synopsis')
			.addSelect('courses.thumbnailUrl', 'thumbnailUrl')
			.addSelect('COUNT(user_id)', 'likes')
			.leftJoin('likes', 'likes', 'likes.course_id = courses.id')
			.leftJoin('users', 'users', 'users.id = likes.user_id')
			.groupBy('courses.id')
			.orderBy('likes', 'DESC')
			.take(10)
			.getRawMany<Course>()

		return courses
	}

	private async isLiked(userId: number, courseId: number): Promise<boolean> {
		const result = await this.likeRepository.findOne({
			where: { userId, courseId }
		})

		return result !== null
	}

	private async isFavorite(userId: number, courseId: number): Promise<boolean> {
		const result = await this.favoriteRepository.findOne({
			where: { userId, courseId }
		})

		return result !== null
	}
}
