import { ComponentLoader, ResourceWithOptions } from 'adminjs'
import { Category } from 'src/categories/category.entity'
import { Course } from 'src/courses/course.entity'
import { Episode } from 'src/episodes/episode.entity'
import { configService } from '../../../config/doenv.config'
import { categoryResourceOptions } from './category-resource-options'
import { courseResourceOptions } from './course-resource-options'
import { episodeResourceOptions } from './episode-resource-options'

const componentLoader = new ComponentLoader()

export const resourceWithOptions = async (): Promise<ResourceWithOptions[]> => {
	const {
		RelationType,
		owningRelationSettingsFeature,
		targetRelationSettingsFeature
	} = await import('@adminjs/relations')

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
			features: [targetRelationSettingsFeature()],
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
				})
			],
			options: episodeResourceOptions
		}
	]
}
