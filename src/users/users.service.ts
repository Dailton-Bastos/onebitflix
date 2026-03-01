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
import { WatchTime } from 'src/episodes/watch-time.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto'
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

	async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { id: userId }
		})

		if (!existingUser) {
			throw new NotFoundException('user not found')
		}

		if (updateUserDto.email) {
			const userWithSameEmail = await this.findByEmail(updateUserDto.email)

			if (userWithSameEmail && userWithSameEmail.id !== userId) {
				throw new ConflictException('email already exists')
			}
		}

		const updatedUser = this.userRepository.create({
			...existingUser,
			...updateUserDto
		})

		return this.userRepository.save(updatedUser)
	}

	async updatePassword(
		userId: number,
		updateUserPasswordDto: UpdateUserPasswordDto
	): Promise<void> {
		const existingUser = await this.userRepository.findOne({
			where: { id: userId }
		})

		if (!existingUser) {
			throw new NotFoundException('user not found')
		}

		try {
			const isCurrentPasswordValid = await this.hashingService.verify(
				updateUserPasswordDto.currentPassword,
				existingUser.password
			)

			if (!isCurrentPasswordValid) {
				throw new BadRequestException('current password is incorrect')
			}

			const hashedNewPassword = await this.hashingService.hash(
				updateUserPasswordDto.newPassword
			)

			existingUser.password = hashedNewPassword

			await this.userRepository.save(existingUser)
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error
			}

			throw new BadRequestException('failed to update password')
		}
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

		const lastWatchTimes = this.filterLastWatchTimesByCourse(user.watchTimes)

		return lastWatchTimes
			.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
			.map((watchTime) => watchTime.episode)
	}

	private filterLastWatchTimesByCourse(watchTimes: WatchTime[]) {
		const coursesOnList: number[] = []

		return watchTimes.reduce((currentList, watchTime) => {
			const courseId = watchTime.episode.courseId

			if (!coursesOnList.includes(courseId)) {
				coursesOnList.push(courseId)
				currentList.push(watchTime)

				return currentList
			}

			const watchTimeFromSameCourse = currentList.find(
				(wt) => wt.episode.courseId === courseId
			)

			if (
				watchTimeFromSameCourse?.updatedAt &&
				watchTimeFromSameCourse.updatedAt > watchTime.updatedAt
			) {
				return currentList
			}

			const listWithoutWatchTimeFromSameCourse = currentList.filter(
				(wt) => wt.episode.courseId !== courseId
			)

			listWithoutWatchTimeFromSameCourse.push(watchTime)

			return listWithoutWatchTimeFromSameCourse
		}, [] as WatchTime[])
	}
}
