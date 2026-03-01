import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoursesModule } from 'src/courses/courses.module'
import { Like } from './like.entity'
import { LikesController } from './likes.controller'
import { LikesService } from './likes.service'

@Module({
	imports: [TypeOrmModule.forFeature([Like]), CoursesModule],
	providers: [LikesService],
	controllers: [LikesController]
})
export class LikesModule {}
