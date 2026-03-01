import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
	Argon2HashingService,
	HashingService
} from 'src/common/hashing/hashing.service'
import cookiesConfig from 'src/config/cookies.config'
import jwtConfig from 'src/config/jwt.config'
import { User } from 'src/users/user.entity'
import { UsersService } from 'src/users/users.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './refresh-token.entity'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtLogoutStrategy } from './strategies/jwt-logout.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
	imports: [
		TypeOrmModule.forFeature([User, RefreshToken]),
		PassportModule,
		JwtModule.registerAsync(jwtConfig.asProvider()),
		ConfigModule.forFeature(cookiesConfig)
	],
	providers: [
		AuthService,
		UsersService,
		LocalStrategy,
		JwtRefreshStrategy,
		JwtLogoutStrategy,
		JwtStrategy,
		{
			provide: HashingService,
			useClass: Argon2HashingService
		}
	],
	controllers: [AuthController]
})
export class AuthModule {}
