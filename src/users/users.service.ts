import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRole } from 'src/common/constants'
import { HashingService } from 'src/common/hashing/hashing.service'
import { Episode } from 'src/episodes/episode.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos'
import { User } from './user.entity'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly hashingService: HashingService
	) {}

	async findByEmail(email: string): Promise<User | null> {
		if (!email) {
			throw new BadRequestException('email is required')
		}

		return this.userRepository.findOne({ where: { email } })
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const existingUser = await this.findByEmail(createUserDto.email)

		if (existingUser) {
			throw new ConflictException('email already exists')
		}

		const hashedPassword = await this.hashingService.hash(
			createUserDto.password
		)

		const user = this.userRepository.create({
			...createUserDto,
			role: UserRole.USER,
			password: hashedPassword
		})

		return this.userRepository.save(user)
	}

	async getKeepWatchingList(userId: number): Promise<Episode[]> {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: {
				watchTimes: {
					episode: {
						course: true,
						watchTimes: true
					}
				}
			}
		})

		if (!user) throw new NotFoundException('user not found')

		const keepWatchingEpisodes = user.watchTimes.map(
			(watchTime) => watchTime.episode
		)

		const keepWatchingList =
			this.filterLastEpisodesByCourse(keepWatchingEpisodes)

		return keepWatchingList.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
	}

	private filterLastEpisodesByCourse(episodes: Episode[]) {
		const coursesOnList: number[] = []

		const lastEpisodes = episodes.reduce((currentLit, episode) => {
			if (!coursesOnList.includes(episode.courseId)) {
				coursesOnList.push(episode.courseId)
				currentLit.push(episode)

				return currentLit
			}

			const episodeFromSameCourse = currentLit.find(
				(e) => e.courseId === episode.courseId
			)

			if (
				episodeFromSameCourse?.order &&
				episodeFromSameCourse.order > episode.order
			) {
				return currentLit
			}

			const listWithoutEpisodeFromSameCourse = currentLit.filter(
				(e) => e.courseId !== episode.courseId
			)

			listWithoutEpisodeFromSameCourse.push(episode)

			return listWithoutEpisodeFromSameCourse
		}, [] as Episode[])

		return lastEpisodes
	}
}
