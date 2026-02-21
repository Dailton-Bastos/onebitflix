import { Exclude, Expose, Type } from 'class-transformer'
import { EpisodeDto } from 'src/episodes/dtos'

export class CourseDto {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	synopsis: string

	@Expose()
	featured: boolean

	@Expose()
	thumbnailUrl: string

	@Exclude({ toPlainOnly: true })
	categoryId: number

	@Expose()
	isLiked: boolean

	@Expose()
	isFavorite: boolean

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	@Expose()
	@Type(() => EpisodeDto)
	episodes: EpisodeDto[]
}
