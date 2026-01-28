import { ReadStream, Stats } from 'node:fs'
import { Provider } from '@nestjs/common'
import type { Request, Response } from 'express'
import { Episode } from './episode.entity'
import { EpisodesService } from './episodes.service'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const episodeMock = {
	id: 1,
	name: 'episode',
	synopsis: 'synopsis',
	order: 1,
	videoUrl: '/uploads/videos/course-1/episode-1.mp4',
	secondsLong: 100,
	createdAt: new Date(),
	updatedAt: new Date()
} as Episode

export const EpisodesServiceMock: Provider<MockType<EpisodesService>> = {
	provide: EpisodesService,
	useValue: {
		streamEpisodeVideo: jest.fn()
	}
}

export const readStreamMock = {
	pipe: jest.fn()
} as unknown as ReadStream

export const fileStatMock = {
	size: 100
} as Stats

export const responseMock = {
	writeHead: jest.fn(),
	pipe: jest.fn()
} as unknown as Response

export const requestMock = {
	headers: {
		range: undefined
	}
} as unknown as Request

export const requestWithRangeMock = {
	headers: {
		range: 'bytes=0-100'
	}
} as unknown as Request
