import { ResourceOptions } from 'adminjs'

export const courseResourceOptions: ResourceOptions = {
	id: 'Course',
	navigation: 'Catálogo',
	editProperties: [
		'name',
		'synopsis',
		'featured',
		'categoryId',
		'uploadThumbnail'
	],
	filterProperties: [
		'name',
		'synopsis',
		'featured',
		'categoryId',
		'createdAt',
		'updatedAt'
	],
	listProperties: ['id', 'name', 'featured', 'categoryId'],
	showProperties: [
		'id',
		'name',
		'synopsis',
		'featured',
		'thumbnailUrl',
		'categoryId',
		'createdAt',
		'updatedAt'
	]
}
