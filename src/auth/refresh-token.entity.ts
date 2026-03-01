import { User } from 'src/users/user.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	@Index('IDX_REFRESH_TOKENS_TOKEN')
	token: string

	@Column({ name: 'expires_at' })
	expiresAt: Date

	@Column({ name: 'is_revoked', default: false })
	isRevoked: boolean

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@ManyToOne(
		() => User,
		(user) => user.refreshTokens
	)
	@JoinColumn({ name: 'user_id' })
	user: User
}
