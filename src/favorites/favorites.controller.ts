import { Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from 'src/common/decorators'
import { User } from 'src/users/user.entity'
import { CreateFavoriteDto } from './dtos/create-favorite.dto'
import { Favorite } from './favorite.entity'
import { FavoritesService } from './favorites.service'

@Controller('favorites')
export class FavoritesController {
	constructor(private readonly favoritesService: FavoritesService) {}

	@Post()
	async create(
		@Body() createFavoriteDto: CreateFavoriteDto,
		@CurrentUser() user: User
	): Promise<Favorite> {
		return this.favoritesService.create(user.id, createFavoriteDto.courseId)
	}
}
