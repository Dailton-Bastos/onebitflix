import { Course } from 'src/courses/course.entity'
import { User } from 'src/users/user.entity'
import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn
} from 'typeorm'

@Entity({ name: 'favorites' })
export class Favorite extends BaseEntity {
	@PrimaryColumn({ name: 'user_id' })
	userId: number

	@PrimaryColumn({ name: 'course_id' })
	courseId: number

	@ManyToOne(
		() => User,
		(user) => user.favorites
	)
	@JoinColumn({ name: 'user_id' })
	user: User

	@ManyToOne(
		() => Course,
		(course) => course.favorites
	)
	@JoinColumn({ name: 'course_id' })
	course: Course

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date
}
