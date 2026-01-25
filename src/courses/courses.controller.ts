import { Controller, Get, Param } from '@nestjs/common'
import { Serialize } from 'src/common/interceptors'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'
import { CourseDto } from './dtos'

@Controller('courses')
@Serialize(CourseDto)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('/featured')
	async getRandomFeaturedCourses(): Promise<Course[]> {
		return this.coursesService.getRandomFeaturedCourses()
	}

	@Get('/:id')
	async findByIdWithEpisodes(@Param('id') id: number): Promise<Course> {
		return this.coursesService.findByIdWithEpisodes(id)
	}
}
