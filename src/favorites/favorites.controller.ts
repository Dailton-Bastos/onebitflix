import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { PaginationResponseDto } from 'src/common/dtos'
import { Serialize } from 'src/common/interceptors'
import { PaginationDto, PaginationOptionsDto } from 'src/common/pagination'
import { Course } from 'src/courses/course.entity'
import { CourseDto } from 'src/courses/dtos/course.dto'
import { User } from 'src/users/user.entity'
import { CreateFavoriteDto } from './dtos/create-favorite.dto'
import { Favorite } from './favorite.entity'
import { FavoritesService } from './favorites.service'

@Controller('favorites')
export class FavoritesController {
	constructor(private readonly favoritesService: FavoritesService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async create(
		@Body() createFavoriteDto: CreateFavoriteDto,
		@CurrentUser() user: User
	): Promise<Favorite> {
		return this.favoritesService.create(user.id, createFavoriteDto.courseId)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@Serialize(PaginationResponseDto(CourseDto))
	async findByUserId(
		@Query() paginationOptionsDto: PaginationOptionsDto,
		@CurrentUser() user: User
	): Promise<PaginationDto<Course>> {
		return this.favoritesService.findByUserId(user.id, paginationOptionsDto)
	}
}
