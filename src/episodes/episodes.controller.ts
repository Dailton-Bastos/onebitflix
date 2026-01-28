import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { StreamEpisodeVideoDto } from './dtos'
import { EpisodesService } from './episodes.service'

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
}
