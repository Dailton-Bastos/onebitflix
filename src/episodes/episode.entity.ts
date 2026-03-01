import { Course } from 'src/courses/course.entity'
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
import { WatchTime } from './watch-time.entity'

@Entity({ name: 'episodes' })
export class Episode extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@Index('IDX_EPISODES_NAME', { unique: true })
	name: string

	@Column()
	synopsis: string

	@Column()
	order: number

	@Column({ nullable: true, name: 'video_url' })
	videoUrl: string

	@Column({ name: 'seconds_long' })
	secondsLong: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@ManyToOne(
		() => Course,
		(course) => course.episodes,
		{ cascade: ['update'], onDelete: 'RESTRICT' }
	)
	@JoinColumn({ name: 'course_id' })
	course: Course

	@RelationId((episode: Episode) => episode.course)
	@Column({ name: 'course_id' })
	courseId: number

	@OneToMany(
		() => WatchTime,
		(watchTime) => watchTime.episode
	)
	watchTimes: WatchTime[]
}
