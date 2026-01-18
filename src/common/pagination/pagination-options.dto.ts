import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import {
	DEFAULT_PAGINATION_LIMIT,
	MAX_PAGINATION_LIMIT,
	Order
} from '../constants'

import 'reflect-metadata'

export class PaginationOptionsDto {
	@IsEnum(Order)
	@IsOptional()
	readonly order?: Order = Order.ASC

	@Type(() => Number)
	@IsOptional()
	@IsInt()
	@Min(1)
	readonly page: number = 1

	@Type(() => Number)
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(MAX_PAGINATION_LIMIT)
	readonly take: number = DEFAULT_PAGINATION_LIMIT

	get skip() {
		return (this.page - 1) * this.take
	}
}
