import { ResourceOptions } from 'adminjs'

export const episodeResourceOptions: ResourceOptions = {
	id: 'Episode',
	navigation: 'Catálogo',
	editProperties: [
		'name',
		'synopsis',
		'order',
		'uploadVideo',
		'secondsLong',
		'courseId'
	],
	listProperties: [
		'id',
		'name',
		'synopsis',
		'order',
		'secondsLong',
		'courseId'
	],
	showProperties: [
		'id',
		'name',
		'synopsis',
		'order',
		'videoUrl',
		'secondsLong',
		'courseId'
	],
	filterProperties: [
		'name',
		'synopsis',
		'order',
		'secondsLong',
		'courseId',
		'createdAt',
		'updatedAt'
	]
}
