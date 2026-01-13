import { ResourceOptions } from 'adminjs'
import { UserRole } from '../../constants'

export const userResourceOptions: ResourceOptions = {
	id: 'User',
	navigation: 'Administração',
	editProperties: [
		'firstName',
		'lastName',
		'phone',
		'birth',
		'role',
		'email',
		'password'
	],
	listProperties: [
		'id',
		'firstName',
		'lastName',
		'phone',
		'birth',
		'role',
		'email'
	],
	showProperties: [
		'id',
		'firstName',
		'lastName',
		'phone',
		'birth',
		'role',
		'email',
		'createdAt',
		'updatedAt'
	],
	filterProperties: [
		'firstName',
		'lastName',
		'phone',
		'birth',
		'role',
		'email',
		'createdAt',
		'updatedAt'
	],
	properties: {
		birth: { type: 'date' },
		password: { type: 'password' },
		role: {
			availableValues: [
				{
					value: UserRole.ADMIN,
					label: 'Administrador'
				},
				{
					value: UserRole.USER,
					label: 'Usuário Padrão'
				}
			]
		}
	}
}
