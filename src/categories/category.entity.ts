import { Course } from 'src/courses/course.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@Index('IDX_CATEGORIES_NAME', { unique: true })
	name: string

	@Column()
	position: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@OneToMany(
		() => Course,
		(course) => course.category
	)
	courses: Course[]
}
