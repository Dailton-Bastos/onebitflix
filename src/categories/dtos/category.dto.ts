import { Exclude, Expose } from 'class-transformer'

export class CategoryDto {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	position: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date
}
