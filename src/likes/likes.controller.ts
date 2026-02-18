import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { User } from 'src/users/user.entity'
import { CreateLikeDto } from './dtos/create-like.dto'
import { Like } from './like.entity'
import { LikesService } from './likes.service'

@Controller('likes')
export class LikesController {
	constructor(private readonly likesService: LikesService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async create(
		@Body() createLikeDto: CreateLikeDto,
		@CurrentUser() user: User
	): Promise<Like> {
		return this.likesService.create(user.id, createLikeDto.courseId)
	}
}
