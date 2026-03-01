import { IsNotEmpty, IsString } from 'class-validator'

export class StreamEpisodeVideoDto {
	@IsNotEmpty()
	@IsString()
	videoUrl: string
}
