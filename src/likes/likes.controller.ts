import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { User } from 'src/users/user.entity'
import { CreateLikeDto } from './dtos/create-like.dto'
import { DeleteLikeDto } from './dtos/delete-like.dto'
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

	@Delete(':courseId')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(
		@Param() params: DeleteLikeDto,
		@CurrentUser() user: User
	): Promise<void> {
		return this.likesService.delete(user.id, params.courseId)
	}
}
