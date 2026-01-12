import { ResourceWithOptions } from 'adminjs'
import { Category } from 'src/categories/category.entity'
import { categoryResourceOptions } from './category-resource-options'

export const resources: ResourceWithOptions[] = [
	{
		resource: Category,
		options: categoryResourceOptions
	}
]
