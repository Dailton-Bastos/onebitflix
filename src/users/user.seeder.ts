import argon2 from '@node-rs/argon2'
import { DataSource } from 'typeorm'
import { type Seeder, SeederFactoryManager } from 'typeorm-extension'
import { UserRole } from '../common/constants'
import { configService } from '../config/doenv.config'
import { User } from './user.entity'

const DEFAULT_ADMIN = {
	email: configService.getOrThrow<string>('ADMINJS_DEFAULT_EMAIL'),
	password: configService.getOrThrow<string>('ADMINJS_DEFAULT_PASSWORD')
}

export default class UserSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		_factoryManager: SeederFactoryManager
	): Promise<void> {
		const repository = dataSource.getRepository(User)

		const hashedPassword = await argon2.hash(DEFAULT_ADMIN.password)

		const adminUser = {
			email: DEFAULT_ADMIN.email,
			password: hashedPassword,
			firstName: 'Admin',
			lastName: 'Admin',
			phone: '1234567890',
			birth: new Date('1990-01-01'),
			role: UserRole.ADMIN
		}

		const existingUser = await repository.findOne({
			where: { email: adminUser.email }
		})

		if (existingUser) return

		await repository.save(adminUser)
	}
}
