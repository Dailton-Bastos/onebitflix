import { Injectable } from '@nestjs/common'
import argon2 from '@node-rs/argon2'

export abstract class HashingService {
	abstract hash(value: string | Buffer): Promise<string>
	abstract verify(value: string | Buffer, hash: string): Promise<boolean>
}

@Injectable()
export class Argon2HashingService implements HashingService {
	async hash(value: string | Buffer): Promise<string> {
		return argon2.hash(value)
	}

	async verify(value: string | Buffer, hash: string): Promise<boolean> {
		return argon2.verify(hash, value)
	}
}
