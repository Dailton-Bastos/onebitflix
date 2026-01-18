import { PaginationMeta } from '../interfaces'

export class PaginationMetaDto {
	readonly page: number

	readonly take: number

	readonly itemCount: number

	readonly pageCount: number

	readonly hasPreviousPage: boolean

	readonly hasNextPage: boolean

	constructor({ options, itemCount }: PaginationMeta) {
		this.page = options.page
		this.take = options.take
		this.itemCount = itemCount
		this.pageCount = Math.ceil(this.itemCount / this.take)
		this.hasPreviousPage = this.page > 1
		this.hasNextPage = this.page < this.pageCount
	}
}
