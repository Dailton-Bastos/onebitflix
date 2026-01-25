import { Controller, Get, Param, Query } from '@nestjs/common'
import { PaginationResponseDto } from 'src/common/dtos'
import { Serialize } from 'src/common/interceptors'
import { PaginationDto } from 'src/common/pagination'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'
import { CourseDto, SearchDto } from './dtos'

@Controller('courses')
@Serialize(CourseDto)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('/featured')
	async getRandomFeaturedCourses(): Promise<Course[]> {
		return this.coursesService.getRandomFeaturedCourses()
	}

	@Get('/newest')
	async getTopTenNewestCourses(): Promise<Course[]> {
		return this.coursesService.getTopTenNewestCourses()
	}

	@Get('/search')
	@Serialize(PaginationResponseDto(CourseDto))
	async searchByCourseName(
		@Query() searchDto: SearchDto
	): Promise<PaginationDto<Course>> {
		return this.coursesService.searchByCourseName(searchDto)
	}

	@Get('/:id')
	async findByIdWithEpisodes(@Param('id') id: number): Promise<Course> {
		return this.coursesService.findByIdWithEpisodes(id)
	}
}
