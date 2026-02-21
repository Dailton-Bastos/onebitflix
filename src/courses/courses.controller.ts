import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { Public } from 'src/auth/decorators'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { PaginationResponseDto } from 'src/common/dtos'
import { Serialize } from 'src/common/interceptors'
import { PaginationDto } from 'src/common/pagination'
import { User } from 'src/users/user.entity'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'
import { CourseDto, SearchDto } from './dtos'
import { FindByIdWithEpisodesDto } from './dtos/find-by-id-with-episodes.dto'

@Controller('courses')
@Serialize(CourseDto)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Get('/featured')
	async getRandomFeaturedCourses(): Promise<Course[]> {
		return this.coursesService.getRandomFeaturedCourses()
	}

	@Public()
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
	@UseGuards(JwtAuthGuard)
	async findByIdWithEpisodes(
		@Param() { id }: FindByIdWithEpisodesDto,
		@CurrentUser() user: User
	): Promise<CourseDto> {
		return this.coursesService.findByIdWithEpisodes(user.id, id)
	}
}
