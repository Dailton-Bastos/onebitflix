import { Category } from 'src/categories/category.entity'
import { Episode } from 'src/episodes/episode.entity'
import { Favorite } from 'src/favorites/favorite.entity'
import { Like } from 'src/likes/like.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
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
		(category) => category.courses,
		{ cascade: ['update'], onDelete: 'RESTRICT' }
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

	@OneToMany(
		() => Episode,
		(episode) => episode.course
	)
	episodes: Episode[]

	@OneToMany(
		() => Favorite,
		(favorite) => favorite.course
	)
	favorites: Favorite[]

	@OneToMany(
		() => Like,
		(like) => like.course
	)
	likes: Like[]
}
