import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from 'src/courses/course.entity'
import { CoursesService } from 'src/courses/courses.service'
import { Like } from './like.entity'
import { LikesController } from './likes.controller'
import { LikesService } from './likes.service'

@Module({
	imports: [TypeOrmModule.forFeature([Like, Course])],
	providers: [LikesService, CoursesService],
	controllers: [LikesController]
})
export class LikesModule {}
