import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoursesService } from 'src/courses/courses.service'
import { Course } from '../courses/course.entity'
import { Favorite } from './favorite.entity'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'

@Module({
	imports: [TypeOrmModule.forFeature([Favorite, Course])],
	providers: [FavoritesService, CoursesService],
	controllers: [FavoritesController]
})
export class FavoritesModule {}
