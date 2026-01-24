import { Controller, Get, Param } from '@nestjs/common'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'

@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('/:id')
	async findByIdWithEpisodes(@Param('id') id: number): Promise<Course> {
		return this.coursesService.findByIdWithEpisodes(id)
	}
}
