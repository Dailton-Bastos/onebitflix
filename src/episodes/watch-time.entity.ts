import { User } from 'src/users/user.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	RelationId,
	UpdateDateColumn
} from 'typeorm'
import { Episode } from './episode.entity'

@Entity({ name: 'watch_times' })
export class WatchTime extends BaseEntity {
	@PrimaryColumn({ name: 'user_id' })
	@Index('IDX_WATCH_TIMES_USER_ID', { unique: true })
	@RelationId((watchTime: WatchTime) => watchTime.user)
	userId: number

	@PrimaryColumn({ name: 'episode_id' })
	@Index('IDX_WATCH_TIMES_EPISODE_ID', { unique: true })
	@RelationId((watchTime: WatchTime) => watchTime.episode)
	episodeId: number

	@Column()
	seconds: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@ManyToOne(
		() => User,
		(user) => user.watchTimes,
		{ cascade: ['update'], onDelete: 'CASCADE' }
	)
	@JoinColumn({ name: 'user_id' })
	user: User

	@ManyToOne(
		() => Episode,
		(episode) => episode.watchTimes,
		{ cascade: ['update'], onDelete: 'CASCADE' }
	)
	@JoinColumn({ name: 'episode_id' })
	episode: Episode
}
