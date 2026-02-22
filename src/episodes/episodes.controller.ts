import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Serialize } from 'src/common/interceptors/serialize.interceptor'
import { User } from 'src/users/user.entity'
import { StreamEpisodeVideoDto } from './dtos'
import { CreateWatchTimeDto } from './dtos/create-watch-time.dto'
import { GetWatchTimeDto } from './dtos/get-watch-time.dto'
import { WatchTimeResponseDto } from './dtos/watch-time-response.dto'
import { EpisodesService } from './episodes.service'
import { WatchTime } from './watch-time.entity'

@Controller('episodes')
export class EpisodesController {
	constructor(private readonly episodesService: EpisodesService) {}

	@Get('/stream')
	streamEpisodeVideo(
		@Query() streamEpisodeVideoDto: StreamEpisodeVideoDto,
		@Req() request: Request,
		@Res() response: Response
	): Response {
		return this.episodesService.streamEpisodeVideo(
			streamEpisodeVideoDto,
			request,
			response
		)
	}

	@Post('/:id/watch-time')
	@UseGuards(JwtAuthGuard)
	@Serialize(WatchTimeResponseDto)
	async setWatchTime(
		@Param('id') episodeId: number,
		@Body() createWatchTimeDto: CreateWatchTimeDto,
		@CurrentUser() user: User
	): Promise<WatchTime> {
		return this.episodesService.setWatchTime({
			userId: user.id,
			episodeId,
			seconds: createWatchTimeDto.seconds
		})
	}

	@Get('/:episodeId/watch-time')
	@UseGuards(JwtAuthGuard)
	@Serialize(WatchTimeResponseDto)
	async getWatchTime(
		@Param() { episodeId }: GetWatchTimeDto,
		@CurrentUser() user: User
	): Promise<WatchTime | null> {
		return this.episodesService.getWatchTime(user.id, episodeId)
	}
}
