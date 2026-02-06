import { Exclude, Expose } from 'class-transformer'
import { UserRole } from 'src/common/constants/user-role.constant'

export class UserDto {
	@Expose()
	id: number

	@Expose()
	firstName: string

	@Expose()
	lastName: string

	@Expose()
	phone: string

	@Expose()
	birth: Date

	@Expose()
	email: string

	@Exclude()
	password: string

	@Expose()
	role: UserRole

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date
}
