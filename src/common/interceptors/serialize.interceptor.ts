import {
	type CallHandler,
	type ExecutionContext,
	type NestInterceptor,
	UseInterceptors
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map, Observable } from 'rxjs'

interface ClassConstructor<T> {
	new (...args: T[]): T
}

class SerializeInterceptor<T> implements NestInterceptor<T, T> {
	constructor(private dto: ClassConstructor<T>) {}

	intercept(_context: ExecutionContext, next: CallHandler): Observable<T> {
		return next.handle().pipe(
			map((data: T) => {
				return plainToInstance<T, T>(this.dto, data, {
					excludeExtraneousValues: true
				})
			})
		)
	}
}

export function Serialize<T>(dto: ClassConstructor<T>) {
	return UseInterceptors(new SerializeInterceptor(dto))
}
