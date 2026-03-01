import { Exclude, Expose } from 'class-transformer'

export class EpisodeDto {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	synopsis: string

	@Expose()
	order: number

	@Expose()
	videoUrl: string

	@Expose()
	secondsLong: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	@Exclude()
	courseId: number
}
