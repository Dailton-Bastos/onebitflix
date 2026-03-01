import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Episode } from './episode.entity'
import { EpisodesController } from './episodes.controller'
import { EpisodesService } from './episodes.service'
import { WatchTime } from './watch-time.entity'

@Module({
	imports: [TypeOrmModule.forFeature([WatchTime, Episode])],
	controllers: [EpisodesController],
	providers: [EpisodesService]
})
export class EpisodesModule {}
