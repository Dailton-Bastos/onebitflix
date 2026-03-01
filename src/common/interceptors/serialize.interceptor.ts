import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
	UseInterceptors
} from '@nestjs/common'
import { type ClassConstructor, plainToInstance } from 'class-transformer'
import { map, Observable } from 'rxjs'

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor<T, T> {
	constructor(private dto: ClassConstructor<T>) {}

	intercept(_context: ExecutionContext, next: CallHandler): Observable<T> {
		return next.handle().pipe(map((data: T) => this.toPlain(data)))
	}

	private toPlain(data: T) {
		return plainToInstance<T, T>(this.dto, data)
	}
}

export function Serialize<T>(dto: ClassConstructor<T>) {
	return UseInterceptors(new SerializeInterceptor(dto))
}
