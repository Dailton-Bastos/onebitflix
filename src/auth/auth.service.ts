import { Injectable } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dtos'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async register(createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto)
	}
}
