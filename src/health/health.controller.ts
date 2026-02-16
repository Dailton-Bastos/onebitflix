import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/auth/decorators'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Public()
	@Get()
	health() {
		return this.healthService.health()
	}
}
