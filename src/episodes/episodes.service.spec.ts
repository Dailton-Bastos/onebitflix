import fs, { createReadStream } from 'node:fs'
import path from 'node:path'
import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Episode } from 'src/episodes/episode.entity'
import { WatchTime } from 'src/episodes/watch-time.entity'
import { Repository } from 'typeorm'
import { StreamEpisodeVideoDto } from './dtos'
import { CreateWatchTimeDto } from './dtos/create-watch-time.dto'
import { GetWatchTimeDto } from './dtos/get-watch-time.dto'
import { EpisodesService } from './episodes.service'
import {
	episodeMock,
	fileStatMock,
	readStreamMock,
	requestMock,
	requestWithRangeMock,
	responseMock
} from './episodes.service.mock'

describe('EpisodesService', () => {
	let service: EpisodesService
	let watchTimeRepository: Repository<WatchTime>
	let episodeRepository: Repository<Episode>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EpisodesService,
				{
					provide: getRepositoryToken(WatchTime),
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
						save: jest.fn()
					}
				},
				{
					provide: getRepositoryToken(Episode),
					useValue: {
						findOne: jest.fn()
					}
				}
			]
		}).compile()

		service = module.get<EpisodesService>(EpisodesService)
		watchTimeRepository = module.get<Repository<WatchTime>>(
			getRepositoryToken(WatchTime)
		)
		episodeRepository = module.get<Repository<Episode>>(
			getRepositoryToken(Episode)
		)

		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(watchTimeRepository).toBeDefined()
		expect(episodeRepository).toBeDefined()
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

			const pathJoinSpy = jest
				.spyOn(path, 'join')
				.mockReturnValueOnce('/uploads/videos/course-1/episode-1.mp4')

			const statSyncSpy = jest
				.spyOn(fs, 'statSync')
				.mockReturnValueOnce(fileStatMock)

			const createReadStreamSpy = jest
				.spyOn(fs, 'createReadStream')
				.mockReturnValueOnce(readStreamMock)

			service.streamEpisodeVideo(
				streamEpisodeVideoDto,
				requestMock,
				responseMock
			)

			expect(pathJoinSpy).toHaveBeenCalledWith(
				process.cwd(),
				'uploads',
				streamEpisodeVideoDto.videoUrl
			)

			expect(requestMock.headers.range).toBeUndefined()
			expect(statSyncSpy).toHaveBeenCalledTimes(1)
			expect(statSyncSpy).toHaveBeenCalledWith(expect.any(String))
			expect(responseMock.writeHead).toHaveBeenCalledWith(200, {
				'Content-Length': fileStatMock.size,
				'Content-Type': 'video/mp4'
			})
			expect(createReadStreamSpy).toHaveBeenCalledTimes(1)
			expect(createReadStreamSpy).toHaveBeenCalledWith(expect.any(String))
			expect(readStreamMock.pipe).toHaveBeenCalledTimes(1)
			expect(readStreamMock.pipe).toHaveBeenCalledWith(responseMock)
		})

		it('should create a video stream with range', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: '/videos/course-1/episode-1.mp4'
			}

			jest
				.spyOn(path, 'join')
				.mockReturnValueOnce('/uploads/videos/course-1/episode-1.mp4')

			jest.spyOn(fs, 'statSync').mockReturnValueOnce(fileStatMock)

			const createReadStreamSpy = jest
				.spyOn(fs, 'createReadStream')
				.mockReturnValueOnce(readStreamMock)

			const range = requestWithRangeMock.headers.range as string

			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileStatMock.size - 1

			const chunkSize = end - start + 1

			service.streamEpisodeVideo(
				streamEpisodeVideoDto,
				requestWithRangeMock,
				responseMock
			)

			expect(requestWithRangeMock.headers.range).toBe('bytes=0-100')
			expect(responseMock.writeHead).toHaveBeenCalledWith(206, {
				'Content-Length': chunkSize,
				'Content-Range': `bytes ${start}-${end}/${fileStatMock.size}`,
				'Accept-Ranges': 'bytes',
				'Content-Type': 'video/mp4'
			})
			expect(createReadStreamSpy).toHaveBeenCalledWith(expect.any(String), {
				start,
				end
			})
			expect(readStreamMock.pipe).toHaveBeenCalledWith(responseMock)
			expect(fileStatMock.size).toBe(100)
			expect(start).toBe(0)
			expect(end).toBe(100)
			expect(chunkSize).toBe(101)
		})

		it('should throw an error if the videoUrl is not found', () => {
			const streamEpisodeVideoDto: StreamEpisodeVideoDto = {
				videoUrl: 'INVALID_VIDEO_URL'
			}

			jest.spyOn(path, 'join').mockReturnValueOnce(expect.any(String))
			jest.spyOn(fs, 'statSync').mockImplementationOnce(() => {
				throw new Error(
					"ENOENT: no such file or directory, stat 'INVALID_VIDEO_URL'"
				)
			})
			jest.spyOn(fs, 'createReadStream').mockImplementationOnce(() => {
				throw new Error('an error occurred while streaming the video')
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

			jest.spyOn(path, 'join').mockReturnValueOnce(expect.any(String))

			jest.spyOn(fs, 'createReadStream').mockImplementationOnce(() => {
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

	describe('setWatchTime', () => {
		it('should set the watch time for a episode', async () => {
			const setWatchTimeDto: CreateWatchTimeDto = {
				seconds: 10
			}

			jest.spyOn(watchTimeRepository, 'findOne').mockResolvedValueOnce(null)
			jest
				.spyOn(episodeRepository, 'findOne')
				.mockResolvedValueOnce(episodeMock)

			jest
				.spyOn(watchTimeRepository, 'create')
				.mockReturnValueOnce({} as unknown as WatchTime)
			jest
				.spyOn(watchTimeRepository, 'save')
				.mockResolvedValueOnce({} as unknown as WatchTime)

			const result = await service.setWatchTime({
				userId: 1,
				episodeId: 1,
				seconds: setWatchTimeDto.seconds
			})

			expect(watchTimeRepository.findOne).toHaveBeenCalledWith({
				where: { userId: 1, episodeId: 1 }
			})
			expect(episodeRepository.findOne).toHaveBeenCalledWith({
				where: { id: 1 }
			})
			expect(watchTimeRepository.create).toHaveBeenCalledWith({
				user: { id: 1 },
				episode: { id: 1 },
				seconds: setWatchTimeDto.seconds
			})
			expect(watchTimeRepository.save).toHaveBeenCalledWith(
				{} as unknown as WatchTime
			)

			expect(result).toEqual({} as unknown as WatchTime)
		})

		it('should update the watch time for a episode if the watch time already exists', async () => {
			const setWatchTimeDto: CreateWatchTimeDto = {
				seconds: 10
			}

			jest
				.spyOn(watchTimeRepository, 'findOne')
				.mockResolvedValueOnce({} as unknown as WatchTime)
			jest
				.spyOn(episodeRepository, 'findOne')
				.mockResolvedValueOnce(episodeMock)

			jest
				.spyOn(watchTimeRepository, 'save')
				.mockResolvedValueOnce({} as unknown as WatchTime)

			const result = await service.setWatchTime({
				userId: 1,
				episodeId: 1,
				seconds: setWatchTimeDto.seconds
			})

			expect(watchTimeRepository.save).toHaveBeenCalledWith({
				seconds: setWatchTimeDto.seconds
			})

			expect(watchTimeRepository.create).not.toHaveBeenCalled()
			expect(result).toEqual({} as unknown as WatchTime)
		})

		it('should throw an error if the episode is not found', async () => {
			const setWatchTimeDto: CreateWatchTimeDto = {
				seconds: 10
			}

			jest.spyOn(watchTimeRepository, 'findOne').mockResolvedValueOnce(null)
			jest.spyOn(episodeRepository, 'findOne').mockResolvedValueOnce(null)

			await expect(
				service.setWatchTime({
					userId: 1,
					episodeId: 1,
					seconds: setWatchTimeDto.seconds
				})
			).rejects.toThrow(NotFoundException)
		})
	})

	describe('getWatchTime', () => {
		it('should get the watch time for a episode', async () => {
			const getWatchTimeDto: GetWatchTimeDto = {
				episodeId: 1
			}

			jest
				.spyOn(watchTimeRepository, 'findOne')
				.mockResolvedValueOnce({} as unknown as WatchTime)

			const result = await service.getWatchTime(1, getWatchTimeDto.episodeId)

			expect(watchTimeRepository.findOne).toHaveBeenCalledWith({
				where: { userId: 1, episodeId: 1 },
				select: {
					seconds: true
				}
			})

			expect(result).toEqual({} as unknown as WatchTime)
		})

		it('should return null if the watch time is not found', async () => {
			const getWatchTimeDto: GetWatchTimeDto = {
				episodeId: 1
			}

			jest.spyOn(watchTimeRepository, 'findOne').mockResolvedValueOnce(null)

			const result = await service.getWatchTime(1, getWatchTimeDto.episodeId)

			expect(result).toBeNull()
		})
	})
})
