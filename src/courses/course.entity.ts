import { Category } from 'src/categories/category.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'courses' })
export class Course extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@Index('IDX_COURSES_NAME', { unique: true })
	name: string

	@Column()
	synopsis: string

	@Column({ nullable: true, name: 'thumbnail_url' })
	thumbnailUrl: string

	@Column({ default: false })
	featured: boolean

	@ManyToOne(
		() => Category,
		(category) => category.courses
	)
	@JoinColumn({ name: 'category_id' })
	category: Category

	@RelationId((course: Course) => course.category)
	@Column({ name: 'category_id' })
	categoryId: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
