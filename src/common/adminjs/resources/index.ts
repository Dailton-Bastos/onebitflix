import path from 'node:path'
import argon2 from '@node-rs/argon2'
import { ResourceWithOptions, type UploadedFile } from 'adminjs'
import fsExtra from 'fs-extra'
import { Category } from 'src/categories/category.entity'
import { Course } from 'src/courses/course.entity'
import { Episode } from 'src/episodes/episode.entity'
import { User } from 'src/users/user.entity'
import { configService } from '../../../config/doenv.config'
import { componentLoader } from '../components'
import { categoryResourceOptions } from './category-resource-options'
import { courseResourceOptions } from './course-resource-options'
import { episodeResourceOptions } from './episode-resource-options'
import { userResourceOptions } from './user-resource-options'

export const resourceWithOptions = async (): Promise<ResourceWithOptions[]> => {
	const [
		{
			RelationType,
			owningRelationSettingsFeature,
			targetRelationSettingsFeature
		},
		{ default: uploadFeature, LocalProvider },
		{ default: passwordsFeature }
	] = await Promise.all([
		import('@adminjs/relations'),
		import('@adminjs/upload'),
		import('@adminjs/passwords')
	])

	class CustomLocalProvider extends LocalProvider {
		public async upload(file: UploadedFile, key: string): Promise<void> {
			const filePath =
				process.platform === 'win32' ? this.path(key) : this.path(key).slice(1) // adjusting file path according to OS
			await fsExtra.mkdir(path.dirname(filePath), { recursive: true })
			await fsExtra.move(file.path, filePath, { overwrite: true })
		}
	}

	return [
		{
			resource: Category,
			features: [
				owningRelationSettingsFeature({
					componentLoader,
					licenseKey: configService.getOrThrow<string>('ADMINJS_LICENSE_KEY'),
					relations: {
						course: {
							type: RelationType.OneToMany,
							target: {
								joinKey: 'categoryId',
								resourceId: courseResourceOptions.id as string
							}
						}
					}
				})
			],
			options: categoryResourceOptions
		},
		{
			resource: Course,
			features: [
				targetRelationSettingsFeature(),
				uploadFeature({
					componentLoader,
					provider: new CustomLocalProvider({
						bucket: path.join(__dirname, '../../../../public'),
						opts: {
							baseUrl: '/public'
						}
					}),
					validation: {
						mimeTypes: ['image/jpeg', 'image/png']
					},
					properties: {
						key: 'thumbnailUrl',
						file: 'uploadThumbnail'
					},
					uploadPath: (record, filename) =>
						`thumbnails/course-${record.get('id')}/${filename}`
				})
			],
			options: courseResourceOptions
		},
		{
			resource: Episode,
			features: [
				owningRelationSettingsFeature({
					componentLoader,
					licenseKey: configService.getOrThrow<string>('ADMINJS_LICENSE_KEY'),
					relations: {
						course: {
							type: RelationType.OneToMany,
							target: {
								joinKey: 'courseId',
								resourceId: courseResourceOptions.id as string
							}
						}
					}
				}),
				uploadFeature({
					componentLoader,
					provider: new CustomLocalProvider({
						bucket: path.join(__dirname, '../../../../uploads'),
						opts: {
							baseUrl: '/uploads'
						}
					}),
					validation: {
						mimeTypes: ['video/mp4']
					},
					properties: {
						key: 'videoUrl',
						file: 'uploadVideo'
					},
					uploadPath: (record, filename) =>
						`videos/course-${record.get('courseId')}/${filename}`
				})
			],
			options: episodeResourceOptions
		},
		{
			resource: User,
			options: userResourceOptions,
			features: [
				passwordsFeature({
					componentLoader,
					properties: {
						encryptedPassword: 'password',
						password: 'password'
					},
					hash: argon2.hash
				})
			]
		}
	]
}
