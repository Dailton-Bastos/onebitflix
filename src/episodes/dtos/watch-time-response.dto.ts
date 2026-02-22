import { Exclude, Expose } from 'class-transformer'
import { User } from 'src/users/user.entity'
import { Episode } from '../episode.entity'

export class WatchTimeResponseDto {
	@Expose()
	seconds: number

	@Exclude()
	createdAt: Date

	@Exclude()
	updatedAt: Date

	@Exclude()
	user: User

	@Exclude()
	userId: number

	@Exclude()
	episode: Episode

	@Exclude()
	episodeId: number
}
