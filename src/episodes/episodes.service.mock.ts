import { Episode } from './episode.entity'

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
