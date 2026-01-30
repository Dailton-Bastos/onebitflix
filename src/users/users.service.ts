import {
	BadRequestException,
	ConflictException,
	Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRole } from 'src/common/constants'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos'
import { User } from './user.entity'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async findByEmail(email: string): Promise<User | null> {
		if (!email) {
			throw new BadRequestException('email is required')
		}

		return this.userRepository.findOne({ where: { email } })
	}

	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.findByEmail(createUserDto.email)

		if (existingUser) {
			throw new ConflictException('email already exists')
		}

		const user = this.userRepository.create({
			...createUserDto,
			role: UserRole.USER
		})

		return this.userRepository.save(user)
	}
}
