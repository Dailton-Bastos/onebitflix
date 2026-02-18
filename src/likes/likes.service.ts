import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoursesService } from 'src/courses/courses.service'
import { Repository } from 'typeorm'
import { Like } from './like.entity'

@Injectable()
export class LikesService {
	constructor(
		@InjectRepository(Like)
		private readonly likeRepository: Repository<Like>,
		private readonly coursesService: CoursesService
	) {}

	async create(userId: number, courseId: number): Promise<Like> {
		const existingCourse = await this.coursesService.findById(courseId)

		if (!existingCourse) {
			throw new NotFoundException('course not found')
		}

		const like = this.likeRepository.create({ userId, courseId })

		return this.likeRepository.save(like)
	}
}
