import { PAGINATION_META_DEFAULT_VALUES } from '../constants'
import { PaginationMeta } from '../interfaces'

import 'reflect-metadata'

export class PaginationMetaDto {
	readonly page: number

	readonly take: number

	readonly itemCount: number

	readonly pageCount: number

	readonly hasPreviousPage: boolean

	readonly hasNextPage: boolean

	constructor(params: PaginationMeta) {
		const { options, itemCount } = params ?? PAGINATION_META_DEFAULT_VALUES

		this.page = options.page
		this.take = options.take
		this.itemCount = itemCount
		this.pageCount = Math.ceil(this.itemCount / this.take)
		this.hasPreviousPage = this.page > 1
		this.hasNextPage = this.page < this.pageCount
	}
}
