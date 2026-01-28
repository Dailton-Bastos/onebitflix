import fs, { createReadStream, statSync } from 'node:fs'
import path from 'node:path'
import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { StreamEpisodeVideoDto } from './dtos'
import { EpisodesService } from './episodes.service'
import {
	fileStatMock,
	readStreamMock,
	requestMock,
	requestWithRangeMock,
	responseMock
} from './episodes.service.mock'

jest.mock('node:path')

jest.mock('node:fs', () => ({
	statSync: jest.fn().mockImplementation(() => fileStatMock),
	createReadStream: jest.fn().mockImplementation(() => readStreamMock)
}))

const fsMock = fs as jest.Mocked<typeof fs>
// fsMock.createReadStream.mockReturnValue(readStreamMock)

describe('EpisodesService', () => {
	let service: EpisodesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [EpisodesService]
		}).compile()

		service = module.get<EpisodesService>(EpisodesService)

		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('streamEpisodeVideo', () => {
		it('should throw an error if the videoUrl is empty', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: ''
			}

			expect(() =>
				service.streamEpisodeVideo(
					streamEpisodeVideoDto,
					requestMock,
					responseMock
				)
			).toThrow(new BadRequestException('videoUrl is required'))
		})

		it('should create a video stream without range', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: '/videos/course-1/episode-1.mp4'
			}

			const filePath = path.join(
				process.cwd(),
				'uploads',
				streamEpisodeVideoDto.videoUrl
			)

			service.streamEpisodeVideo(
				streamEpisodeVideoDto,
				requestMock,
				responseMock
			)

			expect(path.join).toHaveBeenCalledWith(
				process.cwd(),
				'uploads',
				streamEpisodeVideoDto.videoUrl
			)

			expect(requestMock.headers.range).toBeUndefined()
			expect(statSync).toHaveBeenCalledTimes(1)
			expect(statSync).toHaveBeenCalledWith(filePath)
			expect(responseMock.writeHead).toHaveBeenCalledWith(200, {
				'Content-Length': fileStatMock.size,
				'Content-Type': 'video/mp4'
			})
			expect(createReadStream).toHaveBeenCalledTimes(1)
			expect(createReadStream).toHaveBeenCalledWith(filePath)
			expect(readStreamMock.pipe).toHaveBeenCalledTimes(1)
			expect(readStreamMock.pipe).toHaveBeenCalledWith(responseMock)
		})

		it('should create a video stream with range', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: '/videos/course-1/episode-1.mp4'
			}

			const filePath = path.join(
				process.cwd(),
				'uploads',
				streamEpisodeVideoDto.videoUrl
			)

			const fileStat = statSync(filePath)

			const range = requestWithRangeMock.headers.range as string

			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1

			const chunkSize = end - start + 1

			service.streamEpisodeVideo(
				streamEpisodeVideoDto,
				requestWithRangeMock,
				responseMock
			)

			expect(requestWithRangeMock.headers.range).toBe('bytes=0-100')
			expect(responseMock.writeHead).toHaveBeenCalledWith(206, {
				'Content-Length': chunkSize,
				'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
				'Accept-Ranges': 'bytes',
				'Content-Type': 'video/mp4'
			})
			expect(createReadStream).toHaveBeenCalledWith(filePath, {
				start,
				end
			})
			expect(readStreamMock.pipe).toHaveBeenCalledWith(responseMock)
			expect(fileStat.size).toBe(100)
			expect(start).toBe(0)
			expect(end).toBe(100)
			expect(chunkSize).toBe(101)
		})

		it('should throw an error if the videoUrl is not found', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: 'INVALID_VIDEO_URL'
			}

			jest.spyOn(fsMock, 'statSync').mockImplementation(() => {
				throw new Error(
					"ENOENT: no such file or directory, stat 'INVALID_VIDEO_URL'"
				)
			})

			expect(() =>
				service.streamEpisodeVideo(
					streamEpisodeVideoDto,
					requestMock,
					responseMock
				)
			).toThrow(NotFoundException)

			expect(responseMock.writeHead).not.toHaveBeenCalled()
			expect(createReadStream).not.toHaveBeenCalled()
			expect(readStreamMock.pipe).not.toHaveBeenCalled()
		})

		it('should throw an error if an error occurs while streaming the video', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: '/videos/course-1/episode-1.mp4'
			}

			jest.spyOn(fsMock, 'statSync').mockImplementation(() => {
				throw new Error('an error occurred while streaming the video')
			})

			expect(() =>
				service.streamEpisodeVideo(
					streamEpisodeVideoDto,
					requestMock,
					responseMock
				)
			).toThrow(InternalServerErrorException)

			expect(responseMock.writeHead).not.toHaveBeenCalled()
			expect(createReadStream).not.toHaveBeenCalled()
			expect(readStreamMock.pipe).not.toHaveBeenCalled()
		})
	})
})
