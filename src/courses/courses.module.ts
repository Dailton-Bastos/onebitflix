import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Favorite } from 'src/favorites/favorite.entity'
import { Like } from 'src/likes/like.entity'
import { Course } from './course.entity'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'

@Module({
	imports: [TypeOrmModule.forFeature([Course, Like, Favorite])],
	controllers: [CoursesController],
	providers: [CoursesService],
	exports: [CoursesService]
})
export class CoursesModule {}
