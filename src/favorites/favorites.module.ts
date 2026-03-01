import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoursesModule } from 'src/courses/courses.module'
import { Favorite } from './favorite.entity'
import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'

@Module({
	imports: [TypeOrmModule.forFeature([Favorite]), CoursesModule],
	providers: [FavoritesService],
	controllers: [FavoritesController]
})
export class FavoritesModule {}
