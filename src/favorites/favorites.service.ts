import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
}
