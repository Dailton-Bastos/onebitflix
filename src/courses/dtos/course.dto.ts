import { Exclude, Expose } from 'class-transformer'

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

	@Expose()
	categoryId: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date
}
