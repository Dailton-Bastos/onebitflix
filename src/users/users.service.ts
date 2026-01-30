import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
}
