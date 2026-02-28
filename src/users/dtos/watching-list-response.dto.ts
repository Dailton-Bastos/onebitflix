import { Expose, Type } from 'class-transformer'
import { CourseDto } from 'src/courses/dtos'
import { EpisodeDto } from 'src/episodes/dtos'
import { WatchTimesDto } from './watch-times.dto'

export class WatchingListResponseDto extends EpisodeDto {
	@Expose()
	@Type(() => CourseDto)
	course: CourseDto = new CourseDto()

	@Expose()
	@Type(() => WatchTimesDto)
	watchTimes: WatchTimesDto[] = []
}
