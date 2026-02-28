import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators'
import { Serialize } from 'src/common/interceptors'
import { Episode } from 'src/episodes/episode.entity'
import { WatchingListResponseDto } from './dtos'
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
}
