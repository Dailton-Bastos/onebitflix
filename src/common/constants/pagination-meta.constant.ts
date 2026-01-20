import { DEFAULT_PAGINATION_LIMIT } from './pagination-limit.constant'

export const PAGINATION_META_DEFAULT_VALUES = {
	options: {
		page: 1,
		take: DEFAULT_PAGINATION_LIMIT,
		skip: 0
	},
	itemCount: 0
} as const
