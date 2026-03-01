import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
	Argon2HashingService,
	HashingService
} from 'src/common/hashing/hashing.service'
import { User } from './user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [
		UsersService,
		{
			provide: HashingService,
			useClass: Argon2HashingService
		}
	],
	controllers: [UsersController]
})
export class UsersModule {}
