import { Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserRole } from 'src/common/constants'
import { HashingService } from 'src/common/hashing/hashing.service'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { UsersService } from './users.service'

type MockType<T> = {
	[P in keyof T]?: jest.Mock<object>
}

export const userMock = {
	id: 1,
	email: 'test@test.com',
	firstName: 'Test',
	lastName: 'Test',
	phone: '1234567890',
	birth: new Date('1990-01-01'),
	role: UserRole.USER
} as User

export const UsersServiceMock: Provider<MockType<UsersService>> = {
	provide: UsersService,
	useValue: {
		findByEmail: jest.fn().mockResolvedValue(userMock),
		create: jest.fn().mockResolvedValue(userMock)
	}
}

export const UserRepositoryMock: Provider<MockType<Repository<User>>> = {
	provide: getRepositoryToken(User),
	useValue: {
		findOne: jest.fn().mockResolvedValue(userMock),
		create: jest.fn().mockResolvedValue(userMock),
		save: jest.fn().mockResolvedValue(userMock)
	}
}

export const HashingServiceMock: Provider<MockType<HashingService>> = {
	provide: HashingService,
	useValue: {
		hash: jest.fn().mockResolvedValue(userMock.password)
	}
}
