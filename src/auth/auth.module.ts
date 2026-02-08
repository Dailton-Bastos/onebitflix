import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
	Argon2HashingService,
	HashingService
} from 'src/common/hashing/hashing.service'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [TypeOrmModule.forFeature([User]), PassportModule],
	providers: [
		AuthService,
		UsersService,
		LocalStrategy,
		{
			provide: HashingService,
			useClass: Argon2HashingService
		}
	],
	controllers: [AuthController]
})
export class AuthModule {}
