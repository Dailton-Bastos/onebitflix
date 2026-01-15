import { light } from '@adminjs/themes'
import argon2 from '@node-rs/argon2'
import { type CurrentAdmin, DefaultAuthProvider } from 'adminjs'
import { UserRole } from 'src/common/constants'
import dataSource from 'src/config/data-source.config'
import { User } from 'src/users/user.entity'
import { componentLoader } from '../components'

const authenticate = async ({
	email,
	password
}: {
	email: string
	password: string
}): Promise<CurrentAdmin | null> => {
	try {
		const repository = dataSource.getRepository(User)

		const user = await repository.findOne({ where: { email } })

		if (user && user.role === UserRole.ADMIN) {
			const isPasswordValid = await argon2.verify(user.password, password)

			if (!isPasswordValid) return null

			const currentAdmin: CurrentAdmin = {
				id: user.id.toString(),
				email: user.email,
				title: `${user?.firstName ?? user?.email}`,
				theme: light.id
			}

			return currentAdmin
		}

		return null
	} catch {
		return null
	}
}

export const authProvider = new DefaultAuthProvider({
	componentLoader,
	authenticate
})
