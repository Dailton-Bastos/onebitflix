import { Exclude, Expose, Type } from 'class-transformer'
import { CourseDto } from 'src/courses/dtos'

export class CategoryDto {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	position: number

	@Expose()
	@Type(() => CourseDto)
	courses: CourseDto[]

	@Exclude()
	@Type(() => Number)
	categoryId: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date
}
