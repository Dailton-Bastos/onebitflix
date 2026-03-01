import { Exclude, Expose } from 'class-transformer'

export class WatchTimesDto {
	@Expose()
	seconds: number

	@Expose()
	updatedAt: Date

	@Exclude()
	episodeId: number

	@Exclude()
	userId: number

	@Exclude()
	createdAt: Date
}
