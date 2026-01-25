import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from 'src/common/constants'
import { Repository } from 'typeorm'
import { Course } from './course.entity'

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
}
