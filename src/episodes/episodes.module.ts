import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Episode } from './episode.entity'
import { EpisodesController } from './episodes.controller'
import { EpisodesService } from './episodes.service'

@Module({
	imports: [TypeOrmModule.forFeature([Episode])],
	controllers: [EpisodesController],
	providers: [EpisodesService]
})
export class EpisodesModule {}
