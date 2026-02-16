import { RefreshToken } from 'src/auth/refresh-token.entity'
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
import { UserRole } from '../common/constants'

@Entity({ name: 'users' })
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'first_name' })
	firstName: string

	@Column({ name: 'last_name' })
	lastName: string

	@Column()
	phone: string

	@Column()
	birth: Date

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER
	})
	role: UserRole

	@Column({ unique: true })
	@Index('IDX_USERS_EMAIL', { unique: true })
	email: string

	@Column()
	password: string

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@OneToMany(
		() => RefreshToken,
		(refreshToken) => refreshToken.user
	)
	refreshTokens: RefreshToken[]
}
