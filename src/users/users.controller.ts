import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { Serialize } from 'src/common/interceptors'
import { Episode } from 'src/episodes/episode.entity'
import { UserDto, WatchingListResponseDto } from './dtos'
import { UpdateUserDto } from './dtos/update-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/current/watching')
	@UseGuards(JwtAuthGuard)
	@Serialize(WatchingListResponseDto)
	async getKeepWatchingList(@CurrentUser() user: User): Promise<Episode[]> {
		return this.usersService.getKeepWatchingList(user.id)
	}

	@Get('/current')
	@UseGuards(JwtAuthGuard)
	@Serialize(UserDto)
	async getCurrentUser(@CurrentUser() user: User): Promise<User> {
		return user
	}

	@Patch('/current')
	@UseGuards(JwtAuthGuard)
	@Serialize(UserDto)
	async updateCurrentUser(
		@CurrentUser() user: User,
		@Body() updateUserDto: UpdateUserDto
	): Promise<User> {
		return this.usersService.update(user.id, updateUserDto)
	}
}
