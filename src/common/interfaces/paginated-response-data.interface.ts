export interface PaginatedResponseData<T> {
	data: T
	total: number
	page: number
	perPage: number
	nextPage: number | null
	previousPage: number | null
}
