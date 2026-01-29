import { createReadStream, statSync } from 'node:fs'
import path from 'node:path'
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { StreamEpisodeVideoDto } from './dtos'

@Injectable()
export class EpisodesService {
	streamEpisodeVideo(
		streamEpisodeVideoDto: StreamEpisodeVideoDto,
		request: Request,
		response: Response
	): Response {
		const { videoUrl } = streamEpisodeVideoDto

		if (!videoUrl) {
			throw new BadRequestException('videoUrl is required')
		}

		try {
			const filePath = path.join(process.cwd(), 'uploads', videoUrl)
			const fileStat = statSync(filePath)

			const range = request.headers?.range

			if (!range) {
				response.writeHead(HttpStatus.OK, {
					'Content-Length': fileStat.size,
					'Content-Type': 'video/mp4'
				})

				return createReadStream(filePath).pipe<Response>(response)
			}

			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1

			const chunkSize = end - start + 1

			response.writeHead(HttpStatus.PARTIAL_CONTENT, {
				'Content-Length': chunkSize,
				'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
				'Accept-Ranges': 'bytes',
				'Content-Type': 'video/mp4'
			})

			return createReadStream(filePath, { start, end }).pipe<Response>(response)
		} catch (error) {
			if (error?.stack?.includes('ENOENT')) {
				throw new NotFoundException('video not found')
			}

			throw new InternalServerErrorException(
				'an error occurred while streaming the video'
			)
		}
	}
}
